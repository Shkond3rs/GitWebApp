import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SecondaryNavBar from '../components/navigation/SecondaryNavBar';
import './AddArticlePage.css';

const EditArtistPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isEditingArtist, setIsEditingArtist] = useState(false);
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [artistData, setArtistData] = useState({
    id: '',
    name: '',
    image: ''
  });
  const [articleData, setArticleData] = useState({
    title: '',
    text: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get('http://192.168.1.6:8080/api/artist/get_all');
        setArtists(response.data.artists);
      } catch (error) {
        console.error('Ошибка при загрузке представителей:', error);
      }
    };

    fetchArtists();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filtered = artists.filter(artist =>
        artist.artistName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredArtists(filtered);
    } else {
      setFilteredArtists([]);
    }
  };

  const handleArtistSelect = async (artist) => {
    setSelectedArtist(artist);
    setSearchTerm(artist.artistName);
    setFilteredArtists([]);
    setArtistData({
      id: artist.id,
      name: artist.artistName,
      image: artist.artistImage
    });
    setImageURL(artist.artistImage);

    try {
      const response = await axios.get(`http://192.168.1.6:8080/api/article/get_by_artist_id?artistId=${artist.id}`);
      if (response.data.articleCategoryId === 4) {
        setArticleData({
          title: response.data.title,
          text: response.data.text
        });
      } else {
        setArticleData({
          title: '',
          text: ''
        });
      }
    } catch (error) {
      console.error('Ошибка при загрузке статьи:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setImageURL(URL.createObjectURL(file));
    setIsModified(true);
  };

  const handleArtistChange = (field, value) => {
    setArtistData({ ...artistData, [field]: value });
    setIsModified(true);
  };

  const handleArticleChange = (field, value) => {
    setArticleData({ ...articleData, [field]: value });
    setIsModified(true);
  };

  const handleSaveArtist = async () => {
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify({ artistId: artistData.id, artistName: artistData.name })], { type: 'application/json' }));
    formData.append('file', selectedImage);

    try {
      const response = await axios.post('http://192.168.1.6:8080/api/artist/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      setIsModified(false);
    } catch (error) {
      console.error('Ошибка при обновлении данных представителя:', error);
    }
  };

  const handleSaveArticle = async () => {
    try {
      const response = await axios.post('http://192.168.1.6:8080/api/article/update', {
        id: selectedArtist.articleId,
        title: articleData.title,
        text: articleData.text
      });
      console.log(response.data);
      setIsModified(false);
    } catch (error) {
      console.error('Ошибка при обновлении статьи:', error);
    }
  };

  return (
    <>
      <SecondaryNavBar />
      <div className="add-article-container">
        <div className="gray-background">
          <div className="form-block">
            <p>Редактировать представителя</p>
            <div className="title-input">
              <input
                type="text"
                placeholder="Введите имя представителя"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {filteredArtists.length > 0 && (
                <ul className="suggestions">
                  {filteredArtists.map((artist) => (
                    <li key={artist.id} onClick={() => handleArtistSelect(artist)}>
                      {artist.artistName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {selectedArtist && (
            <div>
              <p style={{ color: 'white' }}>Хотите изменить данные представителя или отредактировать статью?</p>
              <div className="navigation-buttons">
                <button
                  type="button"
                  className="nav-button"
                  style={{ marginBottom: '16px' }}
                  onClick={() => {
                    setIsEditingArtist(true);
                    setIsEditingArticle(false);
                  }}
                >
                  Изменить данные представителя
                </button>
                <button
                  type="button"
                  className="nav-button"
                  style={{ marginBottom: '16px' }}
                  onClick={() => {
                    setIsEditingArtist(false);
                    setIsEditingArticle(true);
                  }}
                >
                  Изменить биографическую статью
                </button>
              </div>

            </div>
          )}
          {isEditingArtist && (
            <div className="form-block">
              <p>Изменить данные представителя</p>
              <div className="title-input">
                <label>Полное имя представителя:</label>
                <input
                  type="text"
                  placeholder="Введите полное имя"
                  value={artistData.name}
                  onChange={(e) => handleArtistChange('name', e.target.value)}
                />
              </div>
              <div className="image-upload-container">
                {imageURL && <img src={imageURL} alt="preview" className="image-preview-circle" />}
                <label htmlFor="imageUpload" className="image-upload-label">Выбрать изображение представителя</label>
                <input type="file" id="imageUpload" onChange={handleImageChange} />
              </div>
              <button
                type="button"
                className="submit-button"
                onClick={handleSaveArtist}
                disabled={!isModified}
              >
                Сохранить изменения представителя
              </button>
            </div>
          )}
          {isEditingArticle && (
            <div className="form-block">
              <p>Изменить биографическую статью</p>
              <div className="title-input">
                <label>Название биографической статьи:</label>
                <input
                  type="text"
                  placeholder="Введите название статьи"
                  value={articleData.title}
                  onChange={(e) => handleArticleChange('title', e.target.value)}
                />
              </div>
              <div className="title-input">
                <label>Текст статьи</label>
                <textarea
                  rows="6"
                  placeholder="Начните писать статью..."
                  value={articleData.text}
                  onChange={(e) => handleArticleChange('text', e.target.value)}
                  style={{ resize: "none" }}
                />
              </div>
              <button
                type="button"
                className="submit-button"
                onClick={handleSaveArticle}
                disabled={!isModified}
              >
                Сохранить изменения
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditArtistPage;
