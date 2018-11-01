# Botphus
Botphus自动化测试管理应用

## 快速起步
### 安装
1. 编译程序
```
npm run build
```

2. 自行安装`mongoDB`和`redis`

3. 配置`config/override.json`,配置项详见[ISystemConfig](src/server/interfaces/common.ts)

### 运行
使用
```
npm run start
```

注意:

- 第一次运行时,会自动进入管理员帐号设置页面进行管理员帐号生成.

### 测试
```
npm run test
```

## 相关问题
暂待补充