import React, { useState } from 'react';
import axios from 'axios';
import SecondaryNavBar from '../components/navigation/SecondaryNavBar';
import './AddArticlePage.css';

const AddArtistPage = () => {
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState('');
  const [selectedBioImages, setSelectedBioImages] = useState([]);
  const [bioImageURLs, setBioImageURLs] = useState([]);
  const [artistData, setArtistData] = useState({
    name: '',
    title: '',
    text: ''
  });
  const [imageDescriptions, setImageDescriptions] = useState({});

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedProfileImage(file);

    // Создаем URL-объект для нового файла и сохраняем его в состоянии
    const imageURL = URL.createObjectURL(file);
    setProfileImageURL(imageURL);
  };

  const handleBioImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedBioImages(files);

    // Создаем URL-объекты для новых файлов и сохраняем их в состоянии
    const newBioImageURLs = files.map(file => URL.createObjectURL(file));
    setBioImageURLs(newBioImageURLs);
  };

  const handleImageDescriptionChange = (index, description) => {
    setImageDescriptions({
      ...imageDescriptions,
      [index]: description
    });
  };

  const handleChangeArtist = (field, value) => {
    setArtistData({ ...artistData, [field]: value });
  };

  const handleSubmit = async () => {
    // Проверяем, что все поля заполнены
    if (
      !artistData.name ||
      !artistData.title ||
      !artistData.text ||
      !selectedProfileImage
    ) {
      alert("Пожалуйста, заполните все поля и добавьте изображение.");
      return;
    }

    const artistRequest = {
      artistName: artistData.name,
    };

    const articleRequest = {
      title: artistData.title,
      text: artistData.text,
      articleCategoryId: 4,
      genreId: null,
      description: selectedBioImages.map((_, index) => imageDescriptions[index] || "")
    };

    const formData = new FormData();
    formData.append('profileImageFile', selectedProfileImage);
    selectedBioImages.forEach((image, index) => {
      formData.append('bioImageFiles', image);
    });
    formData.append('articleRequest', new Blob([JSON.stringify(articleRequest)], { type: 'application/json' }));
    formData.append('artistRequest', new Blob([JSON.stringify(artistRequest)], { type: 'application/json' }));

    try {
      const response = await axios.post('http://192.168.1.6:8080/api/artist/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
    }
  };

  return (
    <>
      <SecondaryNavBar />
      <div className="add-article-container">
        <div className="gray-background">
          <div className="form-block">
            <p>Добавить представителя</p>
            <div className="form-group-container">
              <div className="form-group labels">
                <label>Полное имя представителя:</label>
              </div>
              <div className="title-input">
                <input
                  type="text"
                  placeholder="Введите полное имя"
                  value={artistData.name}
                  onChange={(e) => handleChangeArtist('name', e.target.value)}
                />
              </div>

            </div>
            <div className="image-upload-container">
              {profileImageURL && <img src={profileImageURL} alt="preview" className="image-preview-circle" />}
              <label htmlFor="profileImageUpload" className="image-upload-label">Выбрать изображение представителя</label>
              <input type="file" id="profileImageUpload" onChange={handleProfileImageChange} style={{ display: 'none' }} />
            </div>

          </div>

          <div className="form-block">
            <div className="title-input">
              <label>Название биографической статьи:</label>
              <input
                type="text"
                placeholder="Введите название статьи"
                value={artistData.title}
                onChange={(e) => handleChangeArtist('title', e.target.value)}
              />
            </div>
            <div className="title-input">
              <label>Текст статьи</label>
              <textarea
                rows="6"
                placeholder="Начните писать статью..."
                value={artistData.text}
                onChange={(e) => handleChangeArtist('text', e.target.value)}
                style={{ resize: "none" }}
              />
            </div>


          </div>
        </div>
        <div className="navigation-buttons">
          <button
            type="button"
            className="submit-button"
            onClick={handleSubmit}
          >
            Сохранить представителя
          </button>
        </div>
      </div>
    </>
  );
};

export default AddArtistPage;
