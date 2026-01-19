// script.js - 主应用程序逻辑
console.log('🐶🐶筛选工具 - 脚本加载');

class DogFilterApp {
    constructor() {
        console.log('应用启动');
        this.currentFilter = {
            category: ['男', '女', '夫妻'],
            age: ['70', '75', '80', '85', '90', '95', '00', '05'],
            region: [],
            breed: [],
            hasDog: ['是', '否'],
            dogGender: ['雌', '雄'],
            breeding: ['是', '否'],
            paid: ['是', '否'],
            status: ['进行中', '待就位']
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
        this.loadSampleData();
        console.log('应用初始化完成');
    }

    bindEvents() {
        // 筛选按钮
        const applyBtn = document.getElementById('applyFilterBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilter());
        }

        // 重置按钮
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilter());
        }

        // 登录/注册按钮
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const vipLink = document.getElementById('vipLink');

        if (loginBtn) loginBtn.addEventListener('click', () => this.showLoginModal());
        if (registerBtn) registerBtn.addEventListener('click', () => this.showRegisterModal());
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
        if (vipLink) vipLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleVipLink();
        });

        console.log('事件绑定完成');
    }

    updateUI() {
        // 更新用户界面状态
        const role = 'guest'; // 默认访客
        const roleDisplay = document.getElementById('userRoleDisplay');
        const greeting = document.getElementById('userGreeting');

        if (roleDisplay) roleDisplay.textContent = CONFIG.PERMISSIONS[role].name;
        if (greeting) greeting.textContent = '访客您好！';

        // 更新统计
        this.updateStats();
    }

    loadSampleData() {
        console.log('加载示例数据...');
        // 这里将来会从 data-manager.js 加载真实数据
        this.updateStats();
    }

    updateStats() {
        const totalCountEl = document.getElementById('totalCount');
        const filteredCountEl = document.getElementById('filteredCount');
        if (totalCountEl) totalCountEl.textContent = CONFIG.SAMPLE_DATA.length;
        if (filteredCountEl) filteredCountEl.textContent = CONFIG.SAMPLE_DATA.length;
    }

    applyFilter() {
        console.log('执行筛选逻辑', this.currentFilter);
        alert('筛选功能已触发！当前筛选条件：\n' + JSON.stringify(this.currentFilter, null, 2));
        // 这里将来会调用 data-manager.js 进行筛选
    }

    resetFilter() {
        console.log('重置筛选条件');
        this.currentFilter = {
            category: ['男', '女', '夫妻'],
            age: ['70', '75', '80', '85', '90', '95', '00', '05'],
            region: [],
            breed: [],
            hasDog: ['是', '否'],
            dogGender: ['雌', '雄'],
            breeding: ['是', '否'],
            paid: ['是', '否'],
            status: ['进行中', '待就位']
        };
        alert('筛选条件已重置！');
    }

    showLoginModal() {
        alert('登录模态框（功能开发中）');
    }

    showRegisterModal() {
        alert('注册模态框（功能开发中）');
    }

    logout() {
        alert('退出登录（功能开发中）');
    }

    handleVipLink() {
        alert('此功能需要VIP会员权限，请先登录或注册VIP账号。');
        this.showLoginModal();
    }
}

// 页面加载后启动应用
document.addEventListener('DOMContentLoaded', function() {
    window.app = new DogFilterApp();
});