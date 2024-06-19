import React, { useState, useEffect, useRef } from 'react';
import SecondaryNavBar from '../components/navigation/SecondaryNavBar';
import './AddSchoolPage.css';

const AddSchoolPage = () => {
  const [schoolData, setSchoolData] = useState({
    name: '',
    city: '',
    address: '',
    description: '',
    programs: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/program/get/all');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        const programs = data.programs.map((program) => ({
          id: program.id,
          name: program.programName,
        }));
        setAvailablePrograms(programs);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (field, value) => {
    setSchoolData({ ...schoolData, [field]: value });
  };

  const handleProgramChange = (programName) => {
    const program = availablePrograms.find((p) => p.name === programName);
    const programExists = schoolData.programs.find((p) => p.name === programName);

    if (programExists) {
      setSchoolData({
        ...schoolData,
        programs: schoolData.programs.filter((p) => p.name !== programName),
      });
    } else {
      const newProgram = program || { id: availablePrograms.length + 1, name: programName };
      setSchoolData({
        ...schoolData,
        programs: [...schoolData.programs, newProgram].sort((a, b) => a.id - b.id),
      });
      if (!program) {
        setAvailablePrograms([...availablePrograms, newProgram]);
      }
    }
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    const imageURL = URL.createObjectURL(file);
    setImageURL(imageURL);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleSubmit = async () => {
    // Проверяем, что все поля заполнены
    if (
      !schoolData.name ||
      !schoolData.city ||
      !schoolData.address ||
      !schoolData.description ||
      !selectedImage ||
      schoolData.programs.length === 0
    ) {
      alert('Пожалуйста, заполните все поля и выберите изображение.');
      return;
    }

    const schoolRequest = {
      schoolName: schoolData.name,
      artCategoryId: 1, // Устанавливаем фиксированный id категории искусства
      description: schoolData.description,
      city: schoolData.city,
      street: schoolData.address,
      programsId: schoolData.programs.map((program) => program.id),
    };

    const formData = new FormData();
    formData.append('schoolRequest', new Blob([JSON.stringify(schoolRequest)], { type: 'application/json' }));
    formData.append('file', selectedImage);

    try {
      const response = await fetch('http://localhost:8080/api/school/add', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Школа успешно добавлена!');
        // Сбрасываем состояние после успешного добавления
        setSchoolData({
          name: '',
          city: '',
          address: '',
          description: '',
          programs: [],
        });
        setSelectedImage(null);
        setImageURL('');
      } else {
        throw new Error('Ошибка при добавлении школы');
      }
    } catch (error) {
      console.error('Error adding school:', error);
      alert('Ошибка при добавлении школы');
    }
  };

  const filteredPrograms = availablePrograms.filter(
    (program) =>
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !schoolData.programs.some((p) => p.name === program.name)
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <div className="add-school-container">
        <div className="gray-background">
          <div className="form-block">
            <p>Добавить школу</p>
            <div className="form-group">
              <label>Название учебного заведения</label>
              <input
                type="text"
                value={schoolData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <label>Город</label>
              <input
                type="text"
                value={schoolData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
              <label>Адрес (полный)</label>
              <input
                type="text"
                value={schoolData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
              <label>Программы обучения</label>
              <div className="program-select">
                {schoolData.programs.map((program) => (
                  <button
                    key={program.name}
                    className="program-button"
                    onClick={() => handleProgramChange(program.name)}
                  >
                    {program.name} <span>&times;</span>
                  </button>
                ))}
              </div>
              <div className="program-dropdown" ref={dropdownRef}>
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsDropdownOpen(true)}
                />
                {isDropdownOpen && (
                  <div className="dropdown-content">
                    {filteredPrograms.length > 0 ? (
                      filteredPrograms.map((program) => (
                        <div
                          key={program.name}
                          className="dropdown-item"
                          onClick={() => handleProgramChange(program.name)}
                        >
                          {program.name}
                        </div>
                      ))
                    ) : (
                      <div
                        className="dropdown-item"
                        onClick={() => handleProgramChange(searchQuery)}
                      >
                        Добавить "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
              <label>Описание</label>
              <textarea
                value={schoolData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="description-input"
              />
              <div className="image-upload-container">
                {imageURL && <img src={imageURL} alt="preview" className="image-preview" />}
                <label htmlFor="imageUpload" className="image-upload-label">Выбрать изображение</label>
                <input type="file" id="imageUpload" onChange={handleImageChange} />
              </div>
            </div>
          </div>
          <button type="button" className="submit-button" onClick={handleSubmit}>
            Сохранить
          </button>
        </div>
      </div>
    </>
  );
};

export default AddSchoolPage;
