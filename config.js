// config.js - 配置文件
const CONFIG = {
    // 网站配置
    SITE_NAME: "🐶🐶筛选工具",
    SITE_DESC: "专业的人员信息筛选管理平台",
    SITE_URL: "https://your-username.github.io",

    // 管理员配置
    ADMIN_USERNAME: "admin",
    ADMIN_PASSWORD: "admin123!", // 初始密码，登录后可修改

    // 数据配置
    MAX_RECORDS: 99999,
    DEFAULT_BREEDS: ["拉布拉多", "金毛", "哈士奇", "德牧", "贵宾", "柯基", "柴犬", "萨摩耶", "边牧", "法斗"],
    DEFAULT_REGIONS: [
        "北京市", "天津市", "上海市", "重庆市",
        "河北省", "山西省", "辽宁省", "吉林省", "黑龙江省",
        "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省",
        "河南省", "湖北省", "湖南省", "广东省", "海南省", "四川省",
        "贵州省", "云南省", "陕西省", "甘肃省", "青海省",
        "台湾省", "内蒙古自治区", "广西壮族自治区", "西藏自治区",
        "宁夏回族自治区", "新疆维吾尔自治区", "香港特别行政区", "澳门特别行政区"
    ],

    // 权限配置
    PERMISSIONS: {
        guest: {
            name: "访客",
            icon: "fas fa-user",
            fields: ['id', 'category', 'age', 'region', 'breed'],
            filters: ['category', 'age', 'region', 'breed'],
            actions: ['view'],
            canExport: false,
            canEdit: false,
            canAdd: false
        },
        vip: {
            name: "VIP会员",
            icon: "fas fa-crown",
            fields: ['id', 'category', 'age', 'region', 'breed', 'hasDog', 'dogGender', 'breeding', 'paid', 'status'],
            filters: ['category', 'age', 'region', 'breed', 'hasDog', 'dogGender', 'breeding', 'paid', 'status'],
            actions: ['view', 'export', 'filter_vip'],
            canExport: true,
            canEdit: true,
            canAdd: true
        },
        admin: {
            name: "管理员",
            icon: "fas fa-user-shield",
            fields: ['id', 'category', 'age', 'region', 'breed', 'hasDog', 'dogGender', 'breeding', 'paid', 'status', 'contact'],
            filters: ['category', 'age', 'region', 'breed', 'hasDog', 'dogGender', 'breeding', 'paid', 'status'],
            actions: ['view', 'export', 'edit', 'delete', 'manage'],
            canExport: true,
            canEdit: true,
            canAdd: true,
            canManage: true
        }
    },

    // 默认数据
    SAMPLE_DATA: [
        { id: "00001", category: "男", age: "80", region: "北京市", breed: "拉布拉多", hasDog: "是", dogGender: "雄", breeding: "是", paid: "是", status: "进行中", contact: "138****0001" },
        { id: "00002", category: "女", age: "90", region: "上海市", breed: "金毛", hasDog: "是", dogGender: "雌", breeding: "是", paid: "否", status: "待就位", contact: "139****0002" }
    ],

    // 应用设置
    SETTINGS: {
        autoSave: true,
        saveInterval: 30000, // 30秒自动保存
        maxBackups: 5,
        theme: "light",
        language: "zh-CN"
    }
};

// 全局可用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}