import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SecondaryNavBar from '../components/navigation/SecondaryNavBar';
import './AddArticlePage.css';

const AddArticlePage = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [isAddingTest, setIsAddingTest] = useState(false); // состояние для переключения режимов
  const [articleData, setArticleData] = useState({
    category: '',
    type: '',
    genre: '',
    style: '',
    title: '',
    text: ''
  });

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [genres, setGenres] = useState([]);
  const [articleCategories, setArticleCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    answers: ['', '', '', ''],
    correctAnswers: [false, false, false, false],
    points: '',
    image: null
  });
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(null);
  const [imageDescriptions, setImageDescriptions] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/categories/get_all');
        const categories = response.data.categories;
        setCategories(categories);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTypes = async () => {
      if (articleData.category) {
        try {
          const selectedCategory = categories.find(cat => cat.categoryName === articleData.category);
          if (selectedCategory) {
            const response = await axios.get(`http://localhost:8080/api/types/get?categoryId=${selectedCategory.id}`);
            const types = response.data.types;
            setTypes(types);
          }
        } catch (error) {
          console.error('Ошибка при загрузке типов искусства:', error);
        }
      }
    };

    fetchTypes();
  }, [articleData.category, categories]);

  useEffect(() => {
    const fetchGenres = async () => {
      if (articleData.type) {
        try {
          const selectedType = types.find(type => type.typeName === articleData.type);
          if (selectedType) {
            const response = await axios.get(`http://localhost:8080/api/genres/get?typeId=${selectedType.id}`);
            const genres = response.data.genres;
            setGenres(genres);
          }
        } catch (error) {
          console.error('Ошибка при загрузке жанров:', error);
        }
      }
    };

    fetchGenres();
  }, [articleData.type, types]);

  useEffect(() => {
    const fetchArticleCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/article_categories/get_all');
        const categories = response.data.articleCategories;
        setArticleCategories(categories);
      } catch (error) {
        console.error('Ошибка при загрузке категорий статей:', error);
      }
    };

    fetchArticleCategories();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Создаем URL-объекты для новых файлов и сохраняем их в состоянии
    const newImageURLs = files.map(file => URL.createObjectURL(file));
    setImageURLs(newImageURLs);
  };

  const handleImageDescriptionChange = (index, description) => {
    setImageDescriptions({
      ...imageDescriptions,
      [index]: description
    });
  };

  const handleQuestionChange = (index, value) => {
    const newAnswers = [...currentQuestion.answers];
    newAnswers[index] = value;
    setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
  };

  const handleCorrectAnswerChange = (index) => {
    const newCorrectAnswers = [false, false, false, false];
    newCorrectAnswers[index] = true;
    setCurrentQuestion({ ...currentQuestion, correctAnswers: newCorrectAnswers });
  };

  const handleQuestionImageChange = (e) => {
    const file = e.target.files[0];
    setCurrentQuestion({ ...currentQuestion, image: file });
  };

  const handleAddQuestion = () => {
    const { text, answers, points, correctAnswers, image } = currentQuestion;
    if (text && answers.every(answer => answer) && points && correctAnswers.includes(true)) {
      setQuestions([...questions, { text, answers, points, correctAnswers, image }]);
      setCurrentQuestion({
        text: '',
        answers: ['', '', '', ''],
        correctAnswers: [false, false, false, false],
        points: '',
        image: null
      });

      // Reset textarea size
      const textarea = document.querySelector('.question-textarea');
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.width = '100%';
      }
    } else {
      alert("Please fill in all fields and select one correct answer.");
    }
  };

  const handleQuestionEdit = (index) => {
    setCurrentQuestion(questions[index]);
    setExpandedQuestionIndex(index);

    // Adjust textarea height based on content
    setTimeout(() => {
      const textarea = document.querySelector('.question-textarea');
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      }
    }, 0);
  };

  const handleSaveEditedQuestion = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[expandedQuestionIndex] = { ...currentQuestion };
    setQuestions(updatedQuestions);
    setExpandedQuestionIndex(null);
    setCurrentQuestion({
      text: '',
      answers: ['', '', '', ''],
      correctAnswers: [false, false, false, false],
      points: '',
      image: null
    });

    // Reset textarea size
    const textarea = document.querySelector('.question-textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.width = '100%';
    }
  };

  const handleChangeArticle = (field, value) => {
    setArticleData({ ...articleData, [field]: value });
    if (field === 'category') {
      setArticleData({ ...articleData, type: '', genre: '', style: '', category: value });
      setTypes([]);
      setGenres([]);
    }
    if (field === 'type') {
      setArticleData({ ...articleData, genre: '', type: value });
      setGenres([]);
    }
  };

  const handlePointsChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9\b]+$/.test(value)) {
      setCurrentQuestion({ ...currentQuestion, points: value });
    }
  };

  const handleTextareaChange = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    setCurrentQuestion({ ...currentQuestion, text: textarea.value });
  };

  const handleSubmit = async () => {
    if (
      !articleData.title ||
      !articleData.text ||
      !articleData.category ||
      !articleData.type ||
      !articleData.genre ||
      !articleData.style ||
      questions.length === 0
    ) {
      alert("Пожалуйста, заполните все поля статьи, добавьте изображения и хотя бы один вопрос.");
      return;
    }

    const articleRequest = {
      title: articleData.title,
      text: articleData.text,
      articleCategoryId: articleCategories.find(cat => cat.categoryName === articleData.style)?.id,
      genreId: genres.find(gen => gen.genreName === articleData.genre)?.id,
      description: selectedImages.map((_, index) => imageDescriptions[index] || "")
    };

    const questionRequest = questions.map(question => ({
      question: question.text,
      questionValue: parseInt(question.points),
      answerRequestList: question.answers.map((answer, index) => ({
        answer,
        isCorrect: question.correctAnswers[index]
      }))
    }));

    const formData = new FormData();
    selectedImages.forEach((image) => {
      formData.append('articleFiles', image);
    });
    formData.append('articleRequest', JSON.stringify(articleRequest));
    formData.append('questionRequest', JSON.stringify(questionRequest));
    questions.forEach((question) => {
      if (question.image) {
        formData.append('questionFiles', question.image);
      }
    });

    try {
      const response = await axios.post('http://localhost:8080/api/quiz/add', formData, {
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
        {!isAddingTest ? (
          <div className="gray-background">
            <div className="form-block">
              <p>Добавить статью</p>
              <div className="form-group-container">
                <div className="form-group labels">
                  <label>Выбрать категорию искусства:</label>
                  <label>Выбрать вид искусства:</label>
                  <label>Выбрать жанр:</label>
                  <label>Выбрать тип статьи:</label>
                </div>
                <div className="form-group selects">
                  <select value={articleData.category} onChange={(e) => handleChangeArticle('category', e.target.value)}>
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.categoryName}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                  <select value={articleData.type} onChange={(e) => handleChangeArticle('type', e.target.value)}>
                    <option value="">Выберите вид</option>
                    {types.map((type) => (
                      <option key={type.id} value={type.typeName}>
                        {type.typeName}
                      </option>
                    ))}
                  </select>
                  <select value={articleData.genre} onChange={(e) => handleChangeArticle('genre', e.target.value)}>
                    <option value="">Выберите жанр</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.genreName}>
                        {genre.genreName}
                      </option>
                    ))}
                  </select>
                  <select value={articleData.style} onChange={(e) => handleChangeArticle('style', e.target.value)}>
                    {articleCategories.filter((_, index) => index !== 0 && index !== 3).map((category) => (
                      <option key={category.id} value={category.categoryName}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>

                </div>
              </div>
            </div>

            <div className="form-block">
              <div className="title-input">
                <label>Название статьи:</label>
                <input
                  type="text"
                  placeholder="Введите название статьи"
                  value={articleData.title}
                  onChange={(e) => handleChangeArticle('title', e.target.value)}
                />
              </div>
              <div className="title-input">
                <label>Текст статьи</label>
                <textarea
                  rows="6"
                  placeholder="Начните писать статью..."
                  value={articleData.text}
                  onChange={(e) => handleChangeArticle('text', e.target.value)}
                  style={{ resize: "none" }}
                />
              </div>
              <div className="image-upload-container">
                <label htmlFor="imageUpload" className="image-upload-label">Выбрать изображения</label>
                <input type="file" id="imageUpload" multiple onChange={handleImageChange} />
              </div>
            </div>

            {selectedImages.length > 0 && (
              <div className="form-block combined-block">
                {selectedImages.map((image, index) => (
                  <div key={index} className="image-form-block">
                    <img src={imageURLs[index]} alt={`preview ${index}`} className="image-preview" />
                    <div className="title-input centered-input">
                      <input
                        type="text"
                        placeholder="Введите описание изображения..."
                        value={imageDescriptions[index] || ''}
                        onChange={(e) => handleImageDescriptionChange(index, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="gray-background">
            <div className="form-block">
              <p>Добавить тест</p>
              <div className="title-input">
                <textarea
                  placeholder="Введите вопрос"
                  value={currentQuestion.text}
                  onChange={handleTextareaChange}
                  style={{ resize: 'none', overflow: 'hidden', height: 'auto', width: '100%', maxWidth: '600px' }}
                  rows={1}
                  className="question-textarea"
                />
              </div>

              {currentQuestion.answers.map((answer, index) => (
                <div key={index} className="answer-block">
                  <input
                    type="text"
                    className="answer-input"
                    placeholder={`Ответ ${index + 1}`}
                    value={answer}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                  />
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={currentQuestion.correctAnswers[index]}
                      onChange={() => handleCorrectAnswerChange(index)}
                    />
                    <label>Правильный ответ</label>
                  </div>
                  {index === currentQuestion.answers.length - 1 && (
                    <div className="points-and-image">
                      <input
                        type="text"
                        placeholder="Баллы"
                        value={currentQuestion.points}
                        onChange={handlePointsChange}
                        className="points-input"
                      />
                      <label htmlFor={`imageUpload${index}`} className="image-upload-label">
                        Выбрать изображение
                      </label>
                      <input
                        type="file"
                        id={`imageUpload${index}`}
                        onChange={handleQuestionImageChange}
                      />
                      {currentQuestion.image && (
                        <img
                          src={URL.createObjectURL(currentQuestion.image)}
                          alt="Question"
                          className="question-image-preview"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
              {expandedQuestionIndex === null ? (
                <button type="button" className="add-question-button" onClick={handleAddQuestion}>
                  Добавить вопрос
                </button>
              ) : (
                <button type="button" className="add-question-button" onClick={handleSaveEditedQuestion}>
                  Сохранить изменения
                </button>
              )}
              <div className="added-questions">
                <p>Добавленные вопросы:</p>
                {questions.map((q, index) => (
                  <div
                    key={index}
                    className="question-summary"
                    onClick={() => handleQuestionEdit(index)}
                  >
                    <p>{index + 1}. {q.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="navigation-buttons">
          {isAddingTest && (
            <button
              type="button"
              className="nav-button"
              onClick={() => setIsAddingTest(false)}
            >
              Вернуться к статье
            </button>
          )}
          {!isAddingTest && (
            <button
              type="button"
              className="nav-button"
              onClick={() => setIsAddingTest(true)}
            >
              Перейти к вопросам
            </button>
          )}
          <button
            type="button"
            className="submit-button"
            onClick={handleSubmit}
          >
            Сохранить статью и тест
          </button>
        </div>
      </div>
    </>
  );
};

export default AddArticlePage;
