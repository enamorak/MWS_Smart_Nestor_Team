import React, { useState, useEffect } from 'react';
import { GanttChart as GanttIcon, User, FileText, Image, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { mwsAPI } from '../services/api';

const GanttChartComponent = ({ companyId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    postId: '',
    taskType: 'copywriter',
    assignee: '',
    publishDate: ''
  });

  const taskTypes = {
    copywriter: { label: 'Копирайтер', icon: FileText, color: '#3b82f6', duration: 2 },
    designer: { label: 'Дизайнер', icon: Image, color: '#8b5cf6', duration: 3 },
    editor: { label: 'Редактор', icon: FileText, color: '#10b981', duration: 1 },
    manager: { label: 'Менеджер', icon: User, color: '#f59e0b', duration: 1 },
    scheduler: { label: 'Планировщик', icon: Clock, color: '#ef4444', duration: 1 }
  };

  useEffect(() => {
    loadTasks();
  }, [companyId]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await mwsAPI.getGanttTasks({ companyId });
      const loadedTasks = response.data?.tasks || generateMockTasks();
      setTasks(loadedTasks);
      calculateDateRange(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks(generateMockTasks());
    } finally {
      setLoading(false);
    }
  };

  const generateMockTasks = () => {
    const now = new Date();
    const posts = [
      { id: '1', title: 'Новый продукт 2025 - революция в индустрии', publishDate: new Date(now.getFullYear(), now.getMonth(), 15) },
      { id: '2', title: 'Акция недели - скидки до 70%', publishDate: new Date(now.getFullYear(), now.getMonth(), 18) },
      { id: '3', title: 'За кулисами производства - эксклюзивное видео', publishDate: new Date(now.getFullYear(), now.getMonth(), 20) },
      { id: '4', title: 'Интервью с основателем компании', publishDate: new Date(now.getFullYear(), now.getMonth(), 22) },
      { id: '5', title: 'Отзывы клиентов - реальные истории успеха', publishDate: new Date(now.getFullYear(), now.getMonth(), 25) },
      { id: '6', title: 'Новинка сезона - коллекция 2025', publishDate: new Date(now.getFullYear(), now.getMonth(), 28) },
      { id: '7', title: 'Мастер-класс от экспертов', publishDate: new Date(now.getFullYear(), now.getMonth() + 1, 2) },
      { id: '8', title: 'История успеха - как мы достигли цели', publishDate: new Date(now.getFullYear(), now.getMonth() + 1, 5) },
      { id: '9', title: 'Презентация нового офиса', publishDate: new Date(now.getFullYear(), now.getMonth() + 1, 8) },
      { id: '10', title: 'Партнерство с мировыми лидерами', publishDate: new Date(now.getFullYear(), now.getMonth() + 1, 12) },
      { id: '11', title: 'Обновление сервиса - новые возможности', publishDate: new Date(now.getFullYear(), now.getMonth() + 1, 15) },
      { id: '12', title: 'Кейс-стади: решение сложной задачи', publishDate: new Date(now.getFullYear(), now.getMonth() + 1, 18) }
    ];

    const allTasks = [];
    
    posts.forEach(post => {
      const publishDate = new Date(post.publishDate);
      let currentDate = new Date(publishDate);
      
      // Вычитаем дни назад от даты публикации
      const taskOrder = ['scheduler', 'copywriter', 'designer', 'editor', 'manager'];
      
      taskOrder.forEach((taskType, index) => {
        const typeInfo = taskTypes[taskType];
        const daysBefore = taskOrder.slice(index).reduce((sum, t) => sum + taskTypes[t].duration, 0);
        currentDate.setDate(publishDate.getDate() - daysBefore);
        
        const startDate = new Date(currentDate);
        const endDate = new Date(currentDate);
        endDate.setDate(startDate.getDate() + typeInfo.duration - 1);
        
        allTasks.push({
          id: `${post.id}-${taskType}`,
          postId: post.id,
          postTitle: post.title,
          type: taskType,
          startDate: startDate,
          endDate: endDate,
          status: ['pending', 'in_progress', 'completed'][Math.floor(Math.random() * 3)],
          assignee: getRandomAssignee(taskType),
          publishDate: publishDate
        });
      });
    });
    
    return allTasks;
  };

  const getRandomAssignee = (taskType) => {
    const assignees = {
      copywriter: ['Иван Петров', 'Мария Сидорова', 'Алексей Иванов'],
      designer: ['Анна Козлова', 'Дмитрий Смирнов', 'Елена Волкова'],
      editor: ['Ольга Новикова', 'Сергей Морозов'],
      manager: ['Татьяна Лебедева', 'Павел Соколов'],
      scheduler: ['Андрей Попов', 'Наталья Федорова']
    };
    const list = assignees[taskType] || ['Не назначен'];
    return list[Math.floor(Math.random() * list.length)];
  };

  const calculateDateRange = (tasksList) => {
    if (tasksList.length === 0) return;
    
    const dates = tasksList.flatMap(t => [t.startDate, t.endDate]);
    const minDate = new Date(Math.min(...dates.map(d => new Date(d).getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => new Date(d).getTime())));
    
    setDateRange({ start: minDate, end: maxDate });
  };

  const getDaysBetween = (start, end) => {
    const diffTime = Math.abs(new Date(end) - new Date(start));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getDaysFromStart = (date) => {
    if (!dateRange.start) return 0;
    const diffTime = Math.abs(new Date(date) - new Date(dateRange.start));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPostTasks = (postId) => {
    return tasks.filter(t => t.postId === postId);
  };

  const getUniquePosts = () => {
    const postMap = new Map();
    tasks.forEach(task => {
      if (!postMap.has(task.postId)) {
        postMap.set(task.postId, {
          id: task.postId,
          title: task.postTitle,
          publishDate: task.publishDate
        });
      }
    });
    return Array.from(postMap.values()).sort((a, b) => 
      new Date(a.publishDate) - new Date(b.publishDate)
    );
  };

  const createTask = async (taskData) => {
    try {
      // Находим дату публикации из выбранного поста
      const selectedPostData = getUniquePosts().find(p => p.id === taskData.postId);
      const publishDate = selectedPostData?.publishDate || taskData.publishDate;
      
      const response = await mwsAPI.createTask({
        companyId,
        postId: taskData.postId,
        taskType: taskData.taskType,
        assignee: taskData.assignee,
        publishDate: publishDate ? new Date(publishDate).toISOString() : new Date().toISOString()
      });
      loadTasks();
      setShowTaskModal(false);
      setNewTask({ postId: '', taskType: 'copywriter', assignee: '', publishDate: '' });
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Ошибка при создании задачи');
    }
  };

  const handleCreateTask = () => {
    if (!newTask.postId || !newTask.assignee || !newTask.publishDate) {
      alert('Заполните все поля');
      return;
    }
    createTask(newTask);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={14} strokeWidth={1.5} className="status-icon completed" />;
      case 'in_progress':
        return <Clock size={14} strokeWidth={1.5} className="status-icon in-progress" />;
      default:
        return <AlertCircle size={14} strokeWidth={1.5} className="status-icon pending" />;
    }
  };

  if (loading || !dateRange.start) {
    return <div className="loading-state">Загрузка диаграммы Ганта...</div>;
  }

  const totalDays = getDaysBetween(dateRange.start, dateRange.end);
  const posts = getUniquePosts();

  return (
    <div className="gantt-chart-container">
      <div className="gantt-header">
        <h3>
          <GanttIcon size={20} strokeWidth={1.5} style={{ marginRight: '8px' }} />
          Диаграмма Ганта - План работы над публикациями
        </h3>
        <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
          <Plus size={16} strokeWidth={1.5} />
          <span>Создать задачу</span>
        </button>
      </div>

      {/* Модальное окно создания задачи */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Создать задачу</h3>
              <button className="modal-close" onClick={() => setShowTaskModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Публикация</label>
                <select
                  value={newTask.postId}
                  onChange={(e) => setNewTask({ ...newTask, postId: e.target.value })}
                  className="form-input"
                >
                  <option value="">Выберите публикацию</option>
                  {getUniquePosts().map(post => (
                    <option key={post.id} value={post.id}>
                      {post.title} ({new Date(post.publishDate).toLocaleDateString('ru-RU')})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Тип задачи</label>
                <select
                  value={newTask.taskType}
                  onChange={(e) => setNewTask({ ...newTask, taskType: e.target.value })}
                  className="form-input"
                >
                  {Object.entries(taskTypes).map(([key, info]) => (
                    <option key={key} value={key}>{info.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Исполнитель</label>
                <input
                  type="text"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="form-input"
                  placeholder="Введите имя исполнителя"
                />
              </div>
              
              <div className="form-group">
                <label>Дата публикации</label>
                <input
                  type="date"
                  value={newTask.publishDate}
                  onChange={(e) => setNewTask({ ...newTask, publishDate: e.target.value })}
                  className="form-input"
                />
                <small className="form-hint">
                  Дата публикации поста. Даты задач будут рассчитаны автоматически.
                </small>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowTaskModal(false)}>
                Отмена
              </button>
              <button className="btn-primary" onClick={handleCreateTask}>
                Создать задачу
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="gantt-wrapper-fixed">
        <div className="gantt-sidebar-fixed">
          <div className="gantt-sidebar-header-fixed">Публикация / Задача</div>
          <div className="gantt-sidebar-content">
            {posts.map(post => (
              <div key={post.id} className="gantt-post-group-fixed">
                <div className="gantt-post-title-fixed" onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}>
                  <span className="post-title-text">{post.title}</span>
                  <span className="post-date-fixed">
                    {new Date(post.publishDate).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                {selectedPost === post.id && getPostTasks(post.id).map(task => {
                  const typeInfo = taskTypes[task.type];
                  const Icon = typeInfo.icon;
                  return (
                    <div key={task.id} className="gantt-task-row-fixed">
                      <Icon size={14} style={{ color: typeInfo.color, marginRight: '6px' }} />
                      <span>{typeInfo.label}</span>
                      <span className="task-assignee-fixed">{task.assignee}</span>
                      {getStatusIcon(task.status)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="gantt-timeline-fixed">
          <div className="gantt-timeline-header-fixed">
            <div className="gantt-timeline-header-inner">
              {Array.from({ length: totalDays }, (_, i) => {
                const date = new Date(dateRange.start);
                date.setDate(date.getDate() + i);
                return (
                  <div key={i} className="gantt-timeline-day-fixed">
                    <div className="timeline-day-number-fixed">{date.getDate()}</div>
                    <div className="timeline-day-name-fixed">
                      {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getDay()]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="gantt-timeline-body-fixed">
            <div className="gantt-timeline-body-inner">
              {posts.map(post => {
                const postTasks = getPostTasks(post.id);
                return (
                  <div key={post.id} className="gantt-post-timeline-fixed">
                    <div className="gantt-post-bar-fixed">
                      <div className="publish-date-marker-fixed" style={{
                        left: `${(getDaysFromStart(post.publishDate) / totalDays) * 100}%`
                      }}>
                        <div className="publish-marker-line-fixed"></div>
                        <div className="publish-marker-label-fixed">Публикация</div>
                      </div>
                    </div>
                    
                    {selectedPost === post.id && postTasks.map(task => {
                      const typeInfo = taskTypes[task.type];
                      const startOffset = getDaysFromStart(task.startDate);
                      const duration = getDaysBetween(task.startDate, task.endDate);
                      const width = (duration / totalDays) * 100;
                      const left = (startOffset / totalDays) * 100;
                      
                      return (
                        <div
                          key={task.id}
                          className={`gantt-task-bar-fixed task-${task.status}`}
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                            backgroundColor: typeInfo.color,
                            opacity: task.status === 'completed' ? 0.7 : 1
                          }}
                          title={`${typeInfo.label}: ${task.assignee} (${new Date(task.startDate).toLocaleDateString('ru-RU')} - ${new Date(task.endDate).toLocaleDateString('ru-RU')})`}
                        >
                          <div className="task-bar-label-fixed">{typeInfo.label}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="gantt-legend">
        <div className="legend-title">Легенда:</div>
        {Object.entries(taskTypes).map(([key, info]) => {
          const Icon = info.icon;
          return (
            <div key={key} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: info.color }}></div>
              <Icon size={14} strokeWidth={1.5} />
              <span>{info.label}</span>
            </div>
          );
        })}
        <div className="legend-item">
          <CheckCircle size={14} strokeWidth={1.5} className="status-icon completed" />
          <span>Завершено</span>
        </div>
        <div className="legend-item">
          <Clock size={14} strokeWidth={1.5} className="status-icon in-progress" />
          <span>В работе</span>
        </div>
        <div className="legend-item">
          <AlertCircle size={14} strokeWidth={1.5} className="status-icon pending" />
          <span>Ожидает</span>
        </div>
      </div>
    </div>
  );
};

export default GanttChartComponent;

