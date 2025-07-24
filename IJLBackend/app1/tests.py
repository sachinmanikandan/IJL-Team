from django.test import TestCase
from django.db import transaction
from .models import (
    OperatorMaster, SkillMatrix, Section, OperationList, OperatorLevel,
    MultiSkilling, MonthlySkill, Station, Level, Score, QuizQuestionPaper,
    HQ, Factory, Department, Line
)
from datetime import date, datetime


class SkillMatrixUpdateTestCase(TestCase):
    """Test cases for automatic skill matrix updates when employees pass tests"""

    def setUp(self):
        """Set up test data"""
        # Create organizational hierarchy
        self.hq = HQ.objects.create(name="Test HQ")
        self.factory = Factory.objects.create(hq=self.hq, name="Test Factory")
        self.department = Department.objects.create(factory=self.factory, name="Assembly")
        self.line = Line.objects.create(department=self.department, name="Test Line")

        # Create test employee
        self.employee = OperatorMaster.objects.create(
            employee_code="TEST001",
            full_name="Test Employee",
            date_of_join=date.today(),
            designation="Operator",
            department="Assembly"
        )

        # Create skill matrix
        self.skill_matrix = SkillMatrix.objects.create(
            department="Assembly",
            updated_on=date.today(),
            next_review=date.today(),
            doc_no="SM-001",
            prepared_by="Test Manager"
        )

        # Create section
        self.section = Section.objects.create(
            name="Test Section",
            department=self.skill_matrix
        )

        # Create operation
        self.operation = OperationList.objects.create(
            matrix=self.skill_matrix,
            section=self.section,
            number=1,
            name="Push On Fix",
            minimum_skill_required=2
        )

        # Create station (skill)
        self.station = Station.objects.create(
            station_number=1,
            skill="Push On Fix",
            minimum_skill_required="Level 2",
            min_operator_required=1
        )

        # Create level
        self.level = Level.objects.create(
            line=self.line,
            name="level_2"
        )

        # Create question paper
        self.question_paper = QuizQuestionPaper.objects.create(
            name="Level 2 Push On Fix Test"
        )

        # Create multiskilling entry (scheduled training)
        self.multiskilling = MultiSkilling.objects.create(
            employee=self.employee,
            department=self.skill_matrix,
            section=self.section,
            operation=self.operation,
            skill_level="2",
            date=date.today(),
            status="scheduled"
        )

        # Create monthly skill entry
        self.monthly_skill = MonthlySkill.objects.create(
            multiskilling=self.multiskilling
        )

    def test_skill_matrix_update_on_test_pass(self):
        """Test that skill matrix is updated when employee passes a test"""
        # Initially, employee should have default level 0 or no entry
        operator_levels = OperatorLevel.objects.filter(
            employee=self.employee,
            operation=self.operation,
            skill_matrix=self.skill_matrix
        )

        # Should be no entry initially or level 0
        if operator_levels.exists():
            self.assertEqual(operator_levels.first().level, 0)

        # Create a passing score
        score = Score.objects.create(
            employee=self.employee,
            marks=85,
            test_name="Level 2 Push On Fix Test",
            test=self.question_paper,
            level=self.level,
            skill=self.station,
            percentage=85.0,
            passed=True
        )

        # Manually call update_skill_matrix to test the logic
        # (In real scenario, this would be called by the signal)
        result = score.update_skill_matrix()
        self.assertIsNotNone(result, "update_skill_matrix should return an OperatorLevel instance")

        # Check that operator level was created/updated
        operator_level = OperatorLevel.objects.get(
            employee=self.employee,
            operation=self.operation,
            skill_matrix=self.skill_matrix
        )

        # Should be updated to level 2
        self.assertEqual(operator_level.level, 2)
        print(f"✅ Test passed: Skill level updated to {operator_level.level}")

    def test_monthly_skill_status_update_on_test_pass(self):
        """Test that monthly skills status is updated (not deleted) when employee passes test"""
        # Verify monthly skill exists initially
        self.assertTrue(MonthlySkill.objects.filter(multiskilling=self.multiskilling).exists())

        # Verify multiskilling status is scheduled
        self.assertEqual(self.multiskilling.status, "scheduled")

        # Create a passing score
        score = Score.objects.create(
            employee=self.employee,
            marks=90,
            test_name="Level 2 Push On Fix Test",
            test=self.question_paper,
            level=self.level,
            skill=self.station,
            percentage=90.0,
            passed=True
        )

        # Manually call update_skill_matrix to test the logic
        # (In real scenario, this would be called by the signal)
        result = score.update_skill_matrix()
        self.assertIsNotNone(result, "update_skill_matrix should return an OperatorLevel instance")

        # Check that monthly skill still exists (not deleted)
        monthly_skills_exist = MonthlySkill.objects.filter(multiskilling=self.multiskilling).exists()
        self.assertTrue(monthly_skills_exist)
        print("✅ Test passed: Monthly skills preserved (not deleted)")

        # Check that multiskilling status was updated to completed
        self.multiskilling.refresh_from_db()
        self.assertEqual(self.multiskilling.status, "completed")
        print("✅ Test passed: Multiskilling status updated to completed")

    def test_no_update_on_test_fail(self):
        """Test that skill matrix is not updated when employee fails a test"""
        # Create a failing score
        score = Score.objects.create(
            employee=self.employee,
            marks=40,
            test_name="Level 2 Push On Fix Test",
            test=self.question_paper,
            level=self.level,
            skill=self.station,
            percentage=40.0,
            passed=False
        )

        # Check that no operator level was created
        operator_levels = OperatorLevel.objects.filter(
            employee=self.employee,
            operation=self.operation,
            skill_matrix=self.skill_matrix
        )

        # Should still be no entry or level 0
        if operator_levels.exists():
            self.assertEqual(operator_levels.first().level, 0)

        # Monthly skill should still exist
        self.assertTrue(MonthlySkill.objects.filter(multiskilling=self.multiskilling).exists())

        # Multiskilling status should still be scheduled
        self.multiskilling.refresh_from_db()
        self.assertEqual(self.multiskilling.status, "scheduled")
        print("✅ Test passed: No updates on failed test")

    def test_skill_level_upgrade_only(self):
        """Test that skill level only upgrades, not downgrades"""
        # Create initial operator level at level 3
        OperatorLevel.objects.create(
            employee=self.employee,
            operation=self.operation,
            skill_matrix=self.skill_matrix,
            level=3
        )

        # Create a passing score for level 2 (lower than current level 3)
        score = Score.objects.create(
            employee=self.employee,
            marks=85,
            test_name="Level 2 Push On Fix Test",
            test=self.question_paper,
            level=self.level,
            skill=self.station,
            percentage=85.0,
            passed=True
        )

        # Manually call update_skill_matrix to test the logic
        result = score.update_skill_matrix()
        self.assertIsNotNone(result, "update_skill_matrix should return an OperatorLevel instance")

        # Check that level remained at 3 (no downgrade)
        operator_level = OperatorLevel.objects.get(
            employee=self.employee,
            operation=self.operation,
            skill_matrix=self.skill_matrix
        )

        self.assertEqual(operator_level.level, 3)
        print("✅ Test passed: No downgrade from higher level")

    def tearDown(self):
        """Clean up test data"""
        # Clean up is handled automatically by Django test framework
        pass
