#!/usr/bin/env python
"""
Test script to simulate the complete skill matrix workflow:
1. Add skill to employee (MultiSkilling)
2. Employee takes test (Score)
3. Verify skill matrix updates
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HitachiDojoMain.settings')
django.setup()

from app1.models import *
from datetime import date

def test_complete_workflow():
    print("🧪 Testing Complete Skill Matrix Workflow")
    print("=" * 50)
    
    # Step 1: Get or create test data
    print("\n📋 Step 1: Setting up test data...")
    
    # Get employee
    try:
        employee = OperatorMaster.objects.get(full_name="Sachy")
        print(f"✅ Found employee: {employee.full_name}")
    except OperatorMaster.DoesNotExist:
        print("❌ Employee 'Sachy' not found")
        return
    
    # Get skill matrix
    skill_matrix = SkillMatrix.objects.filter(department="Assembly").first()
    if not skill_matrix:
        print("❌ No Assembly skill matrix found")
        return
    print(f"✅ Found skill matrix: {skill_matrix.department}")
    
    # Get operation
    operation = OperationList.objects.filter(name__icontains="Push").first()
    if not operation:
        print("❌ No Push operation found")
        return
    print(f"✅ Found operation: {operation.name}")
    
    # Get section
    section = Section.objects.first()
    if not section:
        print("❌ No section found")
        return
    print(f"✅ Found section: {section.name}")
    
    # Step 2: Add skill (simulate frontend adding skill)
    print("\n🎯 Step 2: Adding skill to employee...")
    
    # Check if MultiSkilling already exists
    existing_ms = MultiSkilling.objects.filter(
        employee=employee,
        operation=operation,
        department=skill_matrix
    ).first()
    
    if existing_ms:
        print(f"ℹ️  MultiSkilling already exists: {existing_ms.status}")
        multiskilling = existing_ms
    else:
        # Create new MultiSkilling
        multiskilling = MultiSkilling.objects.create(
            employee=employee,
            department=skill_matrix,
            section=section,
            operation=operation,
            skill_level="2",
            date=date.today(),
            status="scheduled"
        )
        print(f"✅ Created MultiSkilling: {multiskilling.employee.full_name} - {multiskilling.operation.name}")
    
    # Step 3: Check OperatorLevel creation
    print("\n📊 Step 3: Checking OperatorLevel creation...")
    
    operator_level = OperatorLevel.objects.filter(
        employee=employee,
        operation=operation,
        skill_matrix=skill_matrix
    ).first()
    
    if operator_level:
        print(f"✅ OperatorLevel exists: Level {operator_level.level}")
    else:
        print("❌ OperatorLevel not created")
        return
    
    # Step 4: Check MonthlySkill creation
    print("\n📅 Step 4: Checking MonthlySkill creation...")
    
    monthly_skill = MonthlySkill.objects.filter(multiskilling=multiskilling).first()
    if monthly_skill:
        print(f"✅ MonthlySkill exists: Status = {monthly_skill.multiskilling.status}")
    else:
        print("❌ MonthlySkill not created")
        return
    
    # Step 5: Simulate test taking
    print("\n🎓 Step 5: Simulating test completion...")
    
    # Get skill station
    station = Station.objects.filter(skill__icontains="Push").first()
    if not station:
        print("❌ No Push skill station found")
        return
    
    # Get level
    level = Level.objects.first()
    if not level:
        print("❌ No level found")
        return
    
    # Create passing score
    score = Score.objects.create(
        employee=employee,
        marks=85,
        test_name=f"{operation.name} Level 2 Test",
        skill=station,
        level=level,
        percentage=85.0,
        passed=True
    )
    print(f"✅ Created passing score: {score.percentage}%")
    
    # Step 6: Verify updates
    print("\n🔍 Step 6: Verifying skill matrix updates...")
    
    # Check OperatorLevel update
    operator_level.refresh_from_db()
    print(f"📊 OperatorLevel: Level {operator_level.level}")
    
    # Check MultiSkilling status
    multiskilling.refresh_from_db()
    print(f"📅 MultiSkilling status: {multiskilling.status}")
    
    # Check MonthlySkill still exists
    monthly_skill_exists = MonthlySkill.objects.filter(multiskilling=multiskilling).exists()
    print(f"📋 MonthlySkill exists: {monthly_skill_exists}")
    
    print("\n🎉 Workflow test completed!")
    print("=" * 50)

if __name__ == "__main__":
    test_complete_workflow()
