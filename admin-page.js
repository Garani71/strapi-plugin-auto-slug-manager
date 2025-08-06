import React, { useState, useEffect } from 'react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    sourceField: 'title',
    fallbackField: 'name',
    handleRichText: true,
    addSuffixForUnique: true,
    supportCyrillic: true,
    updateExistingSlugs: true,
    slugifyOptions: {
      lower: true,
      strict: true,
      locale: 'ru'
    }
  });
  
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Загружаем настройки при монтировании
  useEffect(() => {
    fetchSettings();
    fetchStatus();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/auto-slug-manager/settings');
      const result = await response.json();
      setSettings(result.data);
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await fetch('/auto-slug-manager/status');
      const result = await response.json();
      setStatus(result.data);
    } catch (error) {
      console.error('Ошибка загрузки статуса:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/auto-slug-manager/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      const result = await response.json();
      setMessage('Настройки сохранены успешно!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Ошибка сохранения настроек');
      console.error('Ошибка сохранения:', error);
    }
    setLoading(false);
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return React.createElement('div', {
    style: {
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '900px',
      margin: '0 auto',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }
  },
    // Заголовок
    React.createElement('div', {
      style: {
        marginBottom: '2rem',
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
        border: '1px solid #e2e8f0'
      }
    },
      React.createElement('h1', {
        style: {
          color: '#1e40af',
          marginBottom: '0.5rem',
          fontSize: '2.5rem',
          fontWeight: '700'
        }
      }, '🔗 Auto Slug Manager'),
      React.createElement('p', {
        style: {
          color: '#64748b',
          fontSize: '1.1rem',
          margin: 0
        }
      }, 'Универсальный генератор слагов для всех content-types')
    ),

    // Сообщение об успехе
    message && React.createElement('div', {
      style: {
        backgroundColor: message.includes('Ошибка') ? '#fef2f2' : '#f0f9ff',
        border: `2px solid ${message.includes('Ошибка') ? '#f87171' : '#60a5fa'}`,
        borderRadius: '10px',
        padding: '1rem 1.5rem',
        marginBottom: '1.5rem',
        color: message.includes('Ошибка') ? '#dc2626' : '#1d4ed8',
        fontWeight: '600',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }
    }, message),

    // Статус плагина
    status && React.createElement('div', {
      style: {
        backgroundColor: 'white',
        border: '2px solid #d1fae5',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
      }
    },
      React.createElement('h3', {
        style: {
          color: '#059669',
          marginBottom: '1rem',
          fontSize: '1.3rem',
          fontWeight: '700'
        }
      }, '✅ Статус плагина'),
      React.createElement('div', {
        style: { 
          marginBottom: '0.5rem',
          fontSize: '1rem',
          color: '#374151',
          fontWeight: '500'
        }
      }, `Найдено content-types: ${status.contentTypesCount}`),
      React.createElement('div', {
        style: { 
          fontSize: '0.875rem', 
          color: '#6b7280',
          fontStyle: 'italic'
        }
      }, `Последнее обновление: ${new Date(status.lastUpdate).toLocaleString()}`)
    ),

    // Основные настройки
    React.createElement('div', {
      style: {
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
      }
    },
      React.createElement('h3', {
        style: {
          color: '#1f2937',
          marginBottom: '1.5rem',
          fontSize: '1.3rem',
          fontWeight: '700'
        }
      }, '⚙️ Настройки'),

      // Переключатели
      ...[
        { key: 'enabled', label: 'Включить плагин', desc: 'Глобальное включение/выключение' },
        { key: 'updateExistingSlugs', label: 'Обновлять существующие слаги', desc: 'Перегенерировать при изменении title' },
        { key: 'handleRichText', label: 'Поддержка Rich Text', desc: 'Извлекать текст из Rich Text Blocks и классического Rich Text' },
        { key: 'supportCyrillic', label: 'Поддержка кириллицы', desc: 'Транслитерация русских символов' },
        { key: 'addSuffixForUnique', label: 'Суффиксы для уникальности', desc: 'Добавлять -1, -2, -3 для уникальных слагов' }
      ].map(item => 
        React.createElement('div', {
          key: item.key,
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 0',
            borderBottom: '1px solid #f1f5f9'
          }
        },
          React.createElement('div', null,
            React.createElement('div', {
              style: { 
                fontWeight: '600', 
                marginBottom: '0.25rem',
                color: '#1f2937',
                fontSize: '0.95rem'
              }
            }, item.label),
            React.createElement('div', {
              style: { 
                fontSize: '0.8rem', 
                color: '#6b7280',
                lineHeight: '1.4'
              }
            }, item.desc)
          ),
          React.createElement('label', {
            style: {
              position: 'relative',
              display: 'inline-block',
              width: '60px',
              height: '34px',
              cursor: 'pointer'
            }
          },
            React.createElement('input', {
              type: 'checkbox',
              checked: settings[item.key],
              onChange: () => handleToggle(item.key),
              style: { display: 'none' }
            }),
            React.createElement('span', {
              style: {
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings[item.key] ? '#10b981' : '#ccc',
                borderRadius: '34px',
                transition: '0.4s'
              }
            }),
            React.createElement('span', {
              style: {
                position: 'absolute',
                content: '',
                height: '26px',
                width: '26px',
                left: settings[item.key] ? '30px' : '4px',
                bottom: '4px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: '0.4s'
              }
            })
          )
        )
      )
    ),

    // Настройки полей
    React.createElement('div', {
      style: {
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
      }
    },
      React.createElement('h3', {
        style: {
          color: '#1f2937',
          marginBottom: '1.5rem',
          fontSize: '1.3rem',
          fontWeight: '700'
        }
      }, '📝 Поля источника'),
      
      // Основное поле
      React.createElement('div', {
        style: { marginBottom: '1.5rem' }
      },
        React.createElement('label', {
          style: {
            display: 'block',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }
        }, 'Основное поле для генерации слага'),
        React.createElement('select', {
          value: settings.sourceField,
          onChange: (e) => setSettings(prev => ({ ...prev, sourceField: e.target.value })),
          style: {
            width: '100%',
            padding: '0.875rem',
            border: '2px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '0.95rem',
            backgroundColor: 'white',
            color: '#1f2937',
            fontWeight: '500'
          }
        },
          React.createElement('option', { value: 'title' }, 'title'),
          React.createElement('option', { value: 'name' }, 'name'),
          React.createElement('option', { value: 'label' }, 'label'),
          React.createElement('option', { value: 'heading' }, 'heading'),
          React.createElement('option', { value: 'caption' }, 'caption')
        ),
        React.createElement('p', {
          style: {
            fontSize: '0.8rem',
            color: '#6b7280',
            marginTop: '0.5rem',
            lineHeight: '1.4'
          }
        }, 'Поле, из которого будет генерироваться слаг в первую очередь')
      ),
      
      // Резервное поле  
      React.createElement('div', null,
        React.createElement('label', {
          style: {
            display: 'block',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }
        }, 'Резервное поле'),
        React.createElement('select', {
          value: settings.fallbackField,
          onChange: (e) => setSettings(prev => ({ ...prev, fallbackField: e.target.value })),
          style: {
            width: '100%',
            padding: '0.875rem',
            border: '2px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '0.95rem',
            backgroundColor: 'white',
            color: '#1f2937',
            fontWeight: '500'
          }
        },
          React.createElement('option', { value: 'name' }, 'name'),
          React.createElement('option', { value: 'title' }, 'title'),
          React.createElement('option', { value: 'label' }, 'label'),
          React.createElement('option', { value: 'heading' }, 'heading'),
          React.createElement('option', { value: 'caption' }, 'caption'),
          React.createElement('option', { value: '' }, 'Не использовать')
        ),
        React.createElement('p', {
          style: {
            fontSize: '0.8rem',
            color: '#6b7280',
            marginTop: '0.5rem',
            lineHeight: '1.4'
          }
        }, 'Используется, если основное поле пустое или отсутствует')
      )
    ),

    // Настройки slugify
    React.createElement('div', {
      style: {
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
      }
    },
      React.createElement('h3', {
        style: {
          color: '#1f2937',
          marginBottom: '1.5rem',
          fontSize: '1.3rem',
          fontWeight: '700'
        }
      }, '🔧 Настройки генерации слагов'),
      
      // Локаль
      React.createElement('div', {
        style: { marginBottom: '1.5rem' }
      },
        React.createElement('label', {
          style: {
            display: 'block',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }
        }, 'Локаль для транслитерации'),
        React.createElement('select', {
          value: settings.slugifyOptions?.locale || 'ru',
          onChange: (e) => setSettings(prev => ({ 
            ...prev, 
            slugifyOptions: { 
              ...prev.slugifyOptions, 
              locale: e.target.value 
            } 
          })),
          style: {
            width: '100%',
            padding: '0.875rem',
            border: '2px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '0.95rem',
            backgroundColor: 'white',
            color: '#1f2937',
            fontWeight: '500'
          }
        },
          React.createElement('option', { value: 'ru' }, 'Русская (ru)'),
          React.createElement('option', { value: 'en' }, 'Английская (en)'),
          React.createElement('option', { value: 'de' }, 'Немецкая (de)'),
          React.createElement('option', { value: 'fr' }, 'Французская (fr)'),
          React.createElement('option', { value: 'es' }, 'Испанская (es)'),
          React.createElement('option', { value: 'it' }, 'Итальянская (it)'),
          React.createElement('option', { value: 'pl' }, 'Польская (pl)'),
          React.createElement('option', { value: 'tr' }, 'Турецкая (tr)')
        ),
        React.createElement('p', {
          style: {
            fontSize: '0.8rem',
            color: '#6b7280',
            marginTop: '0.5rem',
            lineHeight: '1.4'
          }
        }, 'Локаль влияет на транслитерацию символов. Например: "ё" → "e" (ru) или "yo" (en)')
      )
    ),

    // Кнопка сохранения
    React.createElement('div', {
      style: { 
        textAlign: 'center',
        paddingBottom: '2rem'
      }
    },
      React.createElement('button', {
        onClick: handleSave,
        disabled: loading,
        style: {
          backgroundColor: loading ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          padding: '1rem 3rem',
          fontSize: '1.1rem',
          fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 4px 6px rgba(59, 130, 246, 0.15)',
          transform: loading ? 'none' : 'translateY(0)'
        },
        onMouseEnter: (e) => {
          if (!loading) {
            e.target.style.backgroundColor = '#2563eb';
            e.target.style.transform = 'translateY(-1px)';
          }
        },
        onMouseLeave: (e) => {
          if (!loading) {
            e.target.style.backgroundColor = '#3b82f6';
            e.target.style.transform = 'translateY(0)';
          }
        }
      }, loading ? 'Сохранение...' : 'Сохранить настройки')
    )
  );
};

export default SettingsPage; 