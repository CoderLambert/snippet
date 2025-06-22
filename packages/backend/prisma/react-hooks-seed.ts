import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 获取已存在的分类和标签
  const frontendCategory = await prisma.category.findFirst({
    where: { name: '前端开发' }
  })

  const reactTag = await prisma.tag.findFirst({
    where: { name: 'React' }
  })

  const hookTag = await prisma.tag.findFirst({
    where: { name: 'Hook' }
  })

  const typescriptTag = await prisma.tag.findFirst({
    where: { name: 'TypeScript' }
  })

  if (!frontendCategory || !reactTag || !hookTag) {
    console.error('必要的分类或标签不存在，请先运行基础种子脚本')
    return
  }

  // React Hook 代码片段
  const snippets = [
    {
      title: 'useState 基础用法',
      description: 'React useState Hook 的基本使用示例',
      language: 'TypeScript',
      code: `import React, { useState } from 'react';

interface User {
  name: string;
  age: number;
}

const UserProfile: React.FC = () => {
  // 基础类型
  const [count, setCount] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // 对象类型
  const [user, setUser] = useState<User>({
    name: '',
    age: 0
  });

  // 数组类型
  const [items, setItems] = useState<string[]>([]);

  const incrementCount = () => {
    setCount(prev => prev + 1);
  };

  const updateUser = (field: keyof User, value: string | number) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItem = (item: string) => {
    setItems(prev => [...prev, item]);
  };

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={incrementCount}>Increment</button>
      
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      
      <div>
        <input
          value={user.name}
          onChange={(e) => updateUser('name', e.target.value)}
          placeholder="User name"
        />
        <input
          type="number"
          value={user.age}
          onChange={(e) => updateUser('age', parseInt(e.target.value))}
          placeholder="User age"
        />
      </div>
    </div>
  );
};

export default UserProfile;`,
      categoryId: frontendCategory.id,
      tagIds: [reactTag.id, hookTag.id, typescriptTag.id]
    },
    {
      title: 'useEffect 生命周期管理',
      description: 'useEffect Hook 用于处理组件生命周期和副作用',
      language: 'TypeScript',
      code: `import React, { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 组件挂载时获取数据
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        setPosts(data.slice(0, 5)); // 只取前5个
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // 空依赖数组，只在组件挂载时执行

  // 监听 posts 变化，更新文档标题
  useEffect(() => {
    document.title = \`Posts (\${posts.length})\`;
  }, [posts]);

  // 清理函数示例
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Timer tick');
    }, 1000);

    // 清理函数，组件卸载时执行
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Posts ({posts.length})</h2>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
};

export default PostList;`,
      categoryId: frontendCategory.id,
      tagIds: [reactTag.id, hookTag.id, typescriptTag.id]
    },
    {
      title: 'useContext 全局状态管理',
      description: '使用 useContext 进行全局状态管理',
      language: 'TypeScript',
      code: `import React, { createContext, useContext, useState, ReactNode } from 'react';

// 定义上下文类型
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

interface UserContextType {
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
  login: (userData: { id: number; name: string; email: string }) => void;
  logout: () => void;
}

// 创建上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const UserContext = createContext<UserContextType | undefined>(undefined);

// 自定义 Hook
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider 组件
interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);

  const login = (userData: { id: number; name: string; email: string }) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// 使用上下文的组件
const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useUser();

  return (
    <header style={{ 
      backgroundColor: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#333' : '#fff',
      padding: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My App</h1>
        <div>
          <button onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
          {user && (
            <div>
              <span>Welcome, {user.name}</span>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const LoginForm: React.FC = () => {
  const { login } = useUser();

  const handleLogin = () => {
    login({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    });
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

// 主应用组件
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <div>
          <Header />
          <main>
            <LoginForm />
          </main>
        </div>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;`,
      categoryId: frontendCategory.id,
      tagIds: [reactTag.id, hookTag.id, typescriptTag.id]
    },
    {
      title: 'useReducer 复杂状态管理',
      description: 'useReducer Hook 用于管理复杂的状态逻辑',
      language: 'TypeScript',
      code: `import React, { useReducer, useCallback } from 'react';

// 定义状态类型
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  loading: boolean;
}

// 定义 Action 类型
type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: number }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'SET_FILTER'; payload: 'all' | 'active' | 'completed' }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer 函数
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false
          }
        ]
      };

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };

    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    default:
      return state;
  }
};

// 初始状态
const initialState: TodoState = {
  todos: [],
  filter: 'all',
  loading: false
};

const TodoApp: React.FC = () => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [inputValue, setInputValue] = React.useState('');

  // 计算过滤后的 todos
  const filteredTodos = React.useMemo(() => {
    switch (state.filter) {
      case 'active':
        return state.todos.filter(todo => !todo.completed);
      case 'completed':
        return state.todos.filter(todo => todo.completed);
      default:
        return state.todos;
    }
  }, [state.todos, state.filter]);

  // 计算统计信息
  const stats = React.useMemo(() => {
    const total = state.todos.length;
    const completed = state.todos.filter(todo => todo.completed).length;
    const active = total - completed;

    return { total, completed, active };
  }, [state.todos]);

  const handleAddTodo = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch({ type: 'ADD_TODO', payload: inputValue.trim() });
      setInputValue('');
    }
  }, [inputValue]);

  const handleToggleTodo = useCallback((id: number) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  }, []);

  const handleDeleteTodo = useCallback((id: number) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  }, []);

  const handleClearCompleted = useCallback(() => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Todo App with useReducer</h1>
      
      {/* 添加 Todo 表单 */}
      <form onSubmit={handleAddTodo} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          style={{ 
            width: '70%', 
            padding: '8px', 
            marginRight: '10px' 
          }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Add Todo
        </button>
      </form>

      {/* 过滤器 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}
          style={{ 
            marginRight: '10px',
            backgroundColor: state.filter === 'all' ? '#007bff' : '#f8f9fa',
            color: state.filter === 'all' ? 'white' : 'black'
          }}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}
          style={{ 
            marginRight: '10px',
            backgroundColor: state.filter === 'active' ? '#007bff' : '#f8f9fa',
            color: state.filter === 'active' ? 'white' : 'black'
          }}
        >
          Active ({stats.active})
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}
          style={{ 
            marginRight: '10px',
            backgroundColor: state.filter === 'completed' ? '#007bff' : '#f8f9fa',
            color: state.filter === 'completed' ? 'white' : 'black'
          }}
        >
          Completed ({stats.completed})
        </button>
        {stats.completed > 0 && (
          <button onClick={handleClearCompleted}>
            Clear Completed
          </button>
        )}
      </div>

      {/* Todo 列表 */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTodos.map(todo => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              borderBottom: '1px solid #eee',
              textDecoration: todo.completed ? 'line-through' : 'none',
              opacity: todo.completed ? 0.6 : 1
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
              style={{ marginRight: '10px' }}
            />
            <span style={{ flex: 1 }}>{todo.text}</span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              style={{ 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {filteredTodos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>
          {state.filter === 'all' 
            ? 'No todos yet. Add one above!' 
            : \`No \${state.filter} todos.\`
          }
        </p>
      )}
    </div>
  );
};

export default TodoApp;`,
      categoryId: frontendCategory.id,
      tagIds: [reactTag.id, hookTag.id, typescriptTag.id]
    },
    {
      title: '自定义 Hook - useLocalStorage',
      description: '创建自定义 Hook 来管理 localStorage',
      language: 'TypeScript',
      code: `import { useState, useEffect } from 'react';

// 自定义 Hook: useLocalStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  // 获取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });

  // 设置值的函数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 允许值是一个函数，这样我们就有了与 useState 相同的 API
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":\`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// 使用示例
interface User {
  id: number;
  name: string;
  email: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  const [preferences, setPreferences] = useLocalStorage('preferences', {
    notifications: true,
    language: 'en',
    fontSize: 14
  });

  const handleLogin = () => {
    setUser({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updatePreferences = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: theme === 'light' ? '#fff' : '#333',
      color: theme === 'light' ? '#333' : '#fff',
      minHeight: '100vh'
    }}>
      <h1>User Profile with useLocalStorage</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>User Status</h2>
        {user ? (
          <div>
            <p>Logged in as: {user.name} ({user.email})</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <p>Not logged in</p>
            <button onClick={handleLogin}>Login</button>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Theme</h2>
        <p>Current theme: {theme}</p>
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Preferences</h2>
        <div>
          <label>
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => updatePreferences('notifications', e.target.checked)}
            />
            Enable Notifications
          </label>
        </div>
        <div>
          <label>
            Language:
            <select
              value={preferences.language}
              onChange={(e) => updatePreferences('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Font Size:
            <input
              type="range"
              min="12"
              max="20"
              value={preferences.fontSize}
              onChange={(e) => updatePreferences('fontSize', parseInt(e.target.value))}
            />
            {preferences.fontSize}px
          </label>
        </div>
      </div>

      <div>
        <h2>Debug Info</h2>
        <pre style={{ 
          backgroundColor: theme === 'light' ? '#f5f5f5' : '#444',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {JSON.stringify({ user, theme, preferences }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default UserProfile;

// 其他自定义 Hook 示例

// useDebounce Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// useWindowSize Hook
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

// usePrevious Hook
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}`,
      categoryId: frontendCategory.id,
      tagIds: [reactTag.id, hookTag.id, typescriptTag.id]
    },
    {
      title: 'useMemo 和 useCallback 性能优化',
      description: '使用 useMemo 和 useCallback 进行性能优化',
      language: 'TypeScript',
      code: `import React, { useState, useMemo, useCallback, memo } from 'react';

// 模拟昂贵的计算
const expensiveCalculation = (count: number): number => {
  console.log('Running expensive calculation...');
  let result = 0;
  for (let i = 0; i < count * 1000000; i++) {
    result += Math.random();
  }
  return result;
};

// 模拟昂贵的组件
interface ExpensiveComponentProps {
  data: number[];
  onItemClick: (index: number) => void;
}

const ExpensiveComponent = memo<ExpensiveComponentProps>(({ data, onItemClick }) => {
  console.log('ExpensiveComponent rendered');
  
  return (
    <div>
      <h3>Expensive Component</h3>
      <ul>
        {data.map((item, index) => (
          <li 
            key={index}
            onClick={() => onItemClick(index)}
            style={{ cursor: 'pointer', padding: '5px' }}
          >
            Item {index}: {item}
          </li>
        ))}
      </ul>
    </div>
  );
});

ExpensiveComponent.displayName = 'ExpensiveComponent';

const PerformanceOptimizedApp: React.FC = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [items, setItems] = useState<number[]>([1, 2, 3, 4, 5]);

  // 使用 useMemo 缓存昂贵的计算结果
  const expensiveValue = useMemo(() => {
    return expensiveCalculation(count);
  }, [count]); // 只有当 count 改变时才重新计算

  // 使用 useMemo 缓存过滤后的数据
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item => item > 2);
  }, [items]); // 只有当 items 改变时才重新过滤

  // 使用 useMemo 缓存排序后的数据
  const sortedItems = useMemo(() => {
    console.log('Sorting items...');
    return [...items].sort((a, b) => b - a);
  }, [items]);

  // 使用 useCallback 缓存函数，避免子组件不必要的重渲染
  const handleItemClick = useCallback((index: number) => {
    console.log(\`Clicked item at index \${index}\`);
    setItems(prev => prev.map((item, i) => 
      i === index ? item * 2 : item
    ));
  }, []); // 空依赖数组，函数永远不会改变

  // 使用 useCallback 缓存事件处理函数
  const handleAddItem = useCallback(() => {
    setItems(prev => [...prev, Math.floor(Math.random() * 100) + 1]);
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleReset = useCallback(() => {
    setItems([1, 2, 3, 4, 5]);
  }, []);

  // 使用 useMemo 缓存 JSX 元素
  const expensiveComponent = useMemo(() => {
    return (
      <ExpensiveComponent 
        data={filteredItems} 
        onItemClick={handleItemClick} 
      />
    );
  }, [filteredItems, handleItemClick]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Performance Optimization with useMemo & useCallback</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Counter (triggers expensive calculation)</h2>
        <p>Count: {count}</p>
        <p>Expensive Value: {expensiveValue.toFixed(2)}</p>
        <button onClick={() => setCount(c => c + 1)}>
          Increment Count
        </button>
        <button onClick={() => setCount(0)}>
          Reset Count
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Text Input (doesn't trigger expensive calculation)</h2>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something..."
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <p>Text: {text}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Items Management</h2>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={handleAddItem} style={{ marginRight: '10px' }}>
            Add Random Item
          </button>
          <button onClick={handleReset}>
            Reset Items
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3>Original Items</h3>
            <ul>
              {items.map((item, index) => (
                <li key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Item {index}: {item}</span>
                  <button onClick={() => handleRemoveItem(index)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3>Filtered Items (> 2)</h3>
            <ul>
              {filteredItems.map((item, index) => (
                <li key={index}>Item: {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Sorted Items (Descending)</h2>
        <ul>
          {sortedItems.map((item, index) => (
            <li key={index}>Item: {item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Expensive Component (Memoized)</h2>
        {expensiveComponent}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
        <h3>Performance Tips:</h3>
        <ul>
          <li>useMemo: 缓存计算结果，避免重复计算</li>
          <li>useCallback: 缓存函数引用，避免子组件重渲染</li>
          <li>React.memo: 缓存组件，避免不必要的重渲染</li>
          <li>只在必要时使用这些优化，过度优化可能适得其反</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceOptimizedApp;`,
      categoryId: frontendCategory.id,
      tagIds: [reactTag.id, hookTag.id, typescriptTag.id]
    }
  ];

  // 创建代码片段
  for (const snippet of snippets) {
    await prisma.snippet.create({
      data: {
        title: snippet.title,
        description: snippet.description,
        language: snippet.language,
        code: snippet.code,
        categoryId: snippet.categoryId,
        tags: {
          connect: snippet.tagIds.map(id => ({ id }))
        }
      }
    });
  }

  console.log('React Hook 代码片段创建完成！');
  console.log('创建了以下片段:');
  snippets.forEach(snippet => {
    console.log(`- ${snippet.title}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 