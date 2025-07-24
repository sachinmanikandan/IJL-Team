import React, { useState, useEffect } from 'react';
import Nav from '../../HomeNav/nav';
import SkillMatrixTable from '../components/SkillMatrixTable';
import { fetchSkillMatrices, fetchOperations, fetchSections, fetchMonthlySkill, fetchOperatorLevels } from '../api/api';
import { SkillMatrix, Operation, Section, MonthlySkill, OperatorLevel, Month, months } from '../api/types';

const SkillMatrixPage: React.FC = () => {
  const [skillMatrices, setSkillMatrices] = useState<SkillMatrix[]>([]);
  const [selectedMatrix, setSelectedMatrix] = useState<SkillMatrix | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [monthlySkills, setMonthlySkills] = useState<MonthlySkill[]>([]);
  const [operatorLevels, setOperatorLevels] = useState<OperatorLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [matricesData, operationsData, sectionsData, monthlySkillsData, operatorLevelsData] = await Promise.all([
          fetchSkillMatrices(),
          fetchOperations(),
          fetchSections(),
          fetchMonthlySkill(),
          fetchOperatorLevels('Assembly') // Start with Assembly department
        ]);

        // Extract unique employees from both monthly skills AND operator levels
        const employeesFromMonthlySkills = monthlySkillsData.reduce((acc: any[], current) => {
          if (!acc.find(item => item.employee_code === current.employee_code)) {
            acc.push({
              employee_code: current.employee_code,
              full_name: current.full_name,
              designation: current.designation,
              date_of_join: current.date_of_join,
              department: current.department,
              section: sectionsData.find(s => s.name === current.section)?.id
            });
          }
          return acc;
        }, []);

        // Since we're now getting employees directly from OperatorLevel data in the table component,
        // we can simplify this and just pass the MonthlySkill employees for backward compatibility
        const uniqueEmployees = employeesFromMonthlySkills;

        setSkillMatrices(matricesData);
        setEmployees(uniqueEmployees);
        setOperations(operationsData);
        setSections(sectionsData);
        setMonthlySkills(monthlySkillsData);
        setOperatorLevels(operatorLevelsData);

        if (matricesData.length > 0) {
          setSelectedMatrix(matricesData[0]);
        }

      } catch (err) {
        console.error('Error loading initial data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleMatrixChange = async (matrix: SkillMatrix) => {
    setSelectedMatrix(matrix);

    // Fetch operator levels for the new department
    try {
      setIsLoading(true);
      const operatorLevelsData = await fetchOperatorLevels(matrix.department);
      setOperatorLevels(operatorLevelsData);
    } catch (error) {
      console.error('Error fetching operator levels for department:', matrix.department, error);
      setError('Failed to load operator levels for selected department');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh data (can be called when skills are updated)
  const refreshData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use the currently selected department, or default to 'Assembly'
      const currentDepartment = selectedMatrix?.department || 'Assembly';

      const [matricesData, operationsData, sectionsData, monthlySkillsData, operatorLevelsData] = await Promise.all([
        fetchSkillMatrices(),
        fetchOperations(),
        fetchSections(),
        fetchMonthlySkill(),
        fetchOperatorLevels(currentDepartment)
      ]);

      // Extract unique employees from both monthly skills AND operator levels
      const employeesFromMonthlySkills = monthlySkillsData.reduce((acc: any[], current) => {
        if (!acc.find(item => item.employee_code === current.employee_code)) {
          acc.push({
            employee_code: current.employee_code,
            full_name: current.full_name,
            designation: current.designation,
            date_of_join: current.date_of_join,
            department: current.department,
            section: sectionsData.find(s => s.name === current.section)?.id
          });
        }
        return acc;
      }, []);

      // Since we're now getting employees directly from OperatorLevel data in the table component,
      // we can simplify this and just pass the MonthlySkill employees for backward compatibility
      const uniqueEmployees = employeesFromMonthlySkills;

      setSkillMatrices(matricesData);
      setEmployees(uniqueEmployees);
      setOperations(operationsData);
      setSections(sectionsData);
      setMonthlySkills(monthlySkillsData);
      setOperatorLevels(operatorLevelsData);

    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <SkillMatrixTable
        skillMatrices={skillMatrices}
        selectedMatrix={selectedMatrix}
        employees={employees}
        operations={operations}
        sections={sections}
        monthlySkills={monthlySkills}
        operatorLevels={operatorLevels}
        months={months}
        isLoading={isLoading}
        error={error}
        onMatrixChange={handleMatrixChange}
        onRefresh={refreshData}
      />
    </>
  );
};

export default SkillMatrixPage;