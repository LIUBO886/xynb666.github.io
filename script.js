// 游戏常量
const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREASE = 10;
const MAX_LEVEL = 10;

// 游戏状态
let canvas, ctx;
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let gameInterval;
let score = 0;
let level = 1;
let isGameRunning = false;

// DOM 元素
let startBtn, pauseBtn, resetBtn;
let scoreDisplay, levelDisplay;

// 初始化游戏
function initGame() {
    // 获取DOM元素
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    startBtn = document.getElementById('startBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');
    scoreDisplay = document.getElementById('score');
    levelDisplay = document.getElementById('level');

    // 设置画布大小
    canvas.width = 600;
    canvas.height = 600;

    // 添加事件监听
    document.addEventListener('keydown', handleKeyPress);
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', resetGame);

    // 初始化游戏状态
    resetGameState();
    draw();
}

// 重置游戏状态
function resetGameState() {
    // 初始化蛇的位置
    snake = [
        {x: 5, y: 10},
        {x: 4, y: 10},
        {x: 3, y: 10}
    ];

    // 重置方向
    direction = 'right';
    nextDirection = 'right';

    // 生成食物
    generateFood();

    // 重置分数和等级
    score = 0;
    level = 1;
    updateScoreAndLevel();

    // 更新按钮状态
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
}

// 开始游戏
function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        gameInterval = setInterval(gameLoop, getCurrentSpeed());
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
    }
}

// 暂停/继续游戏
function togglePause() {
    if (isGameRunning) {
        clearInterval(gameInterval);
        isGameRunning = false;
        pauseBtn.textContent = '继续游戏';
    } else {
        isGameRunning = true;
        gameInterval = setInterval(gameLoop, getCurrentSpeed());
        pauseBtn.textContent = '暂停游戏';
    }
}

// 重置游戏
function resetGame() {
    clearInterval(gameInterval);
    resetGameState();
    isGameRunning = false;
    pauseBtn.textContent = '暂停游戏';
    draw();
}

// 获取当前游戏速度
function getCurrentSpeed() {
    return Math.max(INITIAL_SPEED - (level - 1) * SPEED_INCREASE, 50);
}

// 游戏主循环
function gameLoop() {
    // 更新方向
    direction = nextDirection;
    
    // 移动蛇
    moveSnake();
    
    // 检测碰撞
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    // 检测是否吃到食物
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        
        // 升级逻辑
        if (score % 5 === 0 && level < MAX_LEVEL) {
            level++;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, getCurrentSpeed());
        }
        
        updateScoreAndLevel();
        generateFood();
        // 不删除尾部，蛇增长
    } else {
        // 删除尾部，蛇移动
        snake.pop();
    }
    
    // 绘制游戏画面
    draw();
}

// 移动蛇
function moveSnake() {
    const head = {x: snake[0].x, y: snake[0].y};
    
    // 根据方向移动头部
    switch(direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    
    // 添加新头部
    snake.unshift(head);
}

// 检测碰撞
function checkCollision() {
    const head = snake[0];
    
    // 检测是否撞到边界
    if (head.x < 0 || head.x >= canvas.width / GRID_SIZE || 
        head.y < 0 || head.y >= canvas.height / GRID_SIZE) {
        return true;
    }
    
    // 检测是否撞到自己
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// 游戏结束
function gameOver() {
    clearInterval(gameInterval);
    isGameRunning = false;
    alert(`游戏结束！你的分数是：${score}`);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = '暂停游戏';
}

// 生成食物
function generateFood() {
    let newFood;
    let onSnake;
    
    do {
        onSnake = false;
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / GRID_SIZE)),
            y: Math.floor(Math.random() * (canvas.height / GRID_SIZE))
        };
        
        // 检查食物是否在蛇身上
        for (let segment of snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                onSnake = true;
                break;
            }
        }
    } while (onSnake);
    
    food = newFood;
}

// 更新分数和等级显示
function updateScoreAndLevel() {
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
}

// 处理键盘输入
function handleKeyPress(e) {
    // 方向键控制
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (direction !== 'down') {
                nextDirection = 'up';
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (direction !== 'up') {
                nextDirection = 'down';
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (direction !== 'right') {
                nextDirection = 'left';
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (direction !== 'left') {
                nextDirection = 'right';
            }
            break;
        case ' ': // 空格控制暂停/继续
            if (isGameRunning) {
                togglePause();
            }
            break;
        case 'Enter': // 回车键开始游戏
            if (!isGameRunning) {
                startGame();
            }
            break;
    }
}

// 绘制游戏画面
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制蛇
    drawSnake();
    
    // 绘制食物
    drawFood();
}

// 绘制蛇
function drawSnake() {
    snake.forEach((segment, index) => {
        if (index === 0) {
            // 绘制头部
            ctx.fillStyle = '#e74c3c';
        } else {
            // 绘制身体
            ctx.fillStyle = '#3498db';
        }
        
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
    });
}

// 绘制食物
function drawFood() {
    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 1,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// 当页面加载完成后初始化游戏
window.addEventListener('load', initGame);