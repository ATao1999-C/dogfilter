// auth.js - 用户认证和权限管理
console.log('🔐 认证模块加载');

class AuthManager {
    constructor() {
        this.STORAGE_KEYS = {
            USER: 'dog_filter_user',
            TOKEN: 'dog_filter_token'
        };
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUser();
        this.updateUI();
        console.log('认证管理器就绪');
    }

    // 用户注册（简化版）
    register(username, password, email = '') {
        console.log('注册用户:', username);
        // 简单模拟注册成功
        const newUser = {
            id: 'user_' + Date.now(),
            username: username,
            role: 'guest', // 默认访客
            createdAt: new Date().toISOString()
        };
        this.setCurrentUser(newUser);
        return { success: true, user: newUser };
    }

    // 用户登录（简化版，包含管理员检测）
    login(username, password) {
        console.log('登录尝试:', username);
        
        // 检查是否为管理员
        if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
            const adminUser = {
                id: 'admin-001',
                username: 'admin',
                role: 'admin',
                lastLogin: new Date().toISOString()
            };
            this.setCurrentUser(adminUser);
            return { success: true, user: adminUser };
        }
        
        // 默认访客登录（简化逻辑，真实环境需要验证）
        const guestUser = {
            id: 'guest_' + Date.now(),
            username: username || '访客',
            role: 'guest',
            lastLogin: new Date().toISOString()
        };
        this.setCurrentUser(guestUser);
        return { success: true, user: guestUser };
    }

    // 登出
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.STORAGE_KEYS.USER);
        this.updateUI();
        console.log('用户已登出');
        return true;
    }

    // 获取当前用户角色
    getCurrentRole() {
        if (!this.currentUser) return 'guest';
        return this.currentUser.role;
    }

    // 检查权限
    hasPermission(field) {
        const role = this.getCurrentRole();
        const permissions = CONFIG.PERMISSIONS[role];
        if (!permissions) return false;
        if (field && !permissions.fields.includes(field)) return false;
        return true;
    }

    // 获取用户可见的字段
    getVisibleFields() {
        const role = this.getCurrentRole();
        return CONFIG.PERMISSIONS[role]?.fields || [];
    }

    // 加载用户
    loadUser() {
        const userData = localStorage.getItem(this.STORAGE_KEYS.USER);
        if (userData) {
            this.currentUser = JSON.parse(userData);
            console.log('加载用户:', this.currentUser.username);
        }
    }

    // 设置当前用户
    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
        this.updateUI();
    }

    // 更新UI
    updateUI() {
        const role = this.getCurrentRole();
        const userGreeting = document.getElementById('userGreeting');
        const userRoleDisplay = document.getElementById('userRoleDisplay');
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const registerBtn = document.getElementById('registerBtn');

        if (userGreeting) {
            userGreeting.textContent = this.currentUser ? 
                `欢迎回来，${this.currentUser.username}！` : '访客您好！';
        }
        if (userRoleDisplay) {
            userRoleDisplay.textContent = CONFIG.PERMISSIONS[role]?.name || '访客';
        }
        if (loginBtn && logoutBtn && registerBtn) {
            if (this.currentUser) {
                loginBtn.style.display = 'none';
                registerBtn.style.display = 'none';
                logoutBtn.style.display = 'inline-flex';
            } else {
                loginBtn.style.display = 'inline-flex';
                registerBtn.style.display = 'inline-flex';
                logoutBtn.style.display = 'none';
            }
        }
        console.log('UI更新完成，当前角色:', role);
    }
}

// 创建全局认证管理器
window.authManager = new AuthManager();