import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import '../index.css';


const singleSelectOptions = [
  { value: 'Option 1', label: 'Option 1' },
  { value: 'Option 2', label: 'Option 2' },
  { value: 'Option 3', label: 'Option 3' },
];

let multiSelectOptions = [
  { value: 'Option A', label: 'Option A' },
  { value: 'Option B', label: 'Option B' },
  { value: 'Option C', label: 'Option C' },
];

const Table = () => {
  const savedRows = JSON.parse(localStorage.getItem('rows')) || [{ singleSelect: '', multiSelect: [] }];
  
  const [rows, setRows] = useState(savedRows);
  const [newOption, setNewOption] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('rows', JSON.stringify(rows));
  }, [rows]);

  const handleSingleSelectChange = (selectedOption, index) => {
    const newRows = [...rows];
    newRows[index].singleSelect = selectedOption;
    setRows(newRows);
  };

  const handleMultiSelectChange = (selectedOptions, index) => {
    const newRows = [...rows];
    newRows[index].multiSelect = selectedOptions || [];
    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { singleSelect: '', multiSelect: [] }]);
  };

  const handleAddNewOption = () => {
    if (newOption.trim() === '') {
      setError('Option cannot be empty');
      return;
    }

    const isOptionExist = multiSelectOptions.some(
      (option) => option.label.toLowerCase() === newOption.toLowerCase()
    );
    if (isOptionExist) {
      setError('Option already exists');
      return;
    }

    multiSelectOptions.push({ value: newOption, label: newOption });
    setNewOption('');
    setError('');
  };

  const handleSubmit = () => {
    for (const row of rows) {
      if (!row.singleSelect || row.multiSelect.length === 0) {
        setError('Please select all options before submitting');
        return;
      }
    }
    setError('');
    alert('Form submitted successfully!');
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Column 1 (Single Select)</th>
            <th>Column 2 (Multi Select)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <Select
                  value={row.singleSelect}
                  onChange={(selectedOption) => handleSingleSelectChange(selectedOption, index)}
                  options={singleSelectOptions.filter(
                    (option) => !rows.some((r) => r.singleSelect?.value === option.value)
                  )}
                  isClearable
                />
              </td>
              <td>
                <Select
                  isMulti
                  value={row.multiSelect}
                  onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, index)}
                  options={multiSelectOptions}
                />
                <div>
                  <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add new option"
                  />
                  <button onClick={handleAddNewOption}>Add</button>
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddRow}>Add New Row</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Table;
