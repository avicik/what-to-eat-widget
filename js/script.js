import foods from './foods.js';

const card = document.getElementById('foodCard');
const text = document.getElementById('foodText');
const lastFood = document.getElementById('lastFood');
const recentFoods = new Set();
const MAX_RECENT_FOODS = 10;
let isAnimating = false;
let isFireworkActive = false;

function createFirework(x, y) {
    const colors = ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'];
    
    for (let i = 0; i < 80; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        document.body.appendChild(particle);
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = (Math.random() * Math.PI * 2);
        const velocity = 2 + Math.random() * 2;
        const size = Math.random() * 3 + 1;
        
        particle.style.backgroundColor = color;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        let life = 100;
        
        function animate() {
            if (life <= 0) {
                particle.remove();
                return;
            }
            
            posX += dx;
            posY += dy;
            opacity -= 0.01;
            life--;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            requestAnimationFrame(animate);
        }
        
        requestAnimationFrame(animate);
    }
    
    isFireworkActive = true;
    setTimeout(() => {
        isFireworkActive = false;
    }, 1000);
}

function getRandomFood() {
    let availableFoods = foods.filter(food => !recentFoods.has(food));
    
    if (availableFoods.length === 0) {
        recentFoods.clear();
        availableFoods = foods;
    }
    
    const randomIndex = Math.floor(Math.random() * availableFoods.length);
    const newFood = availableFoods[randomIndex];
    
    recentFoods.add(newFood);
    
    if (recentFoods.size > MAX_RECENT_FOODS) {
        const firstItem = recentFoods.values().next().value;
        recentFoods.delete(firstItem);
    }
    
    return newFood;
}

// 使用防抖处理点击事件
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleClick() {
    if (isAnimating || isFireworkActive) {
        return;
    }
    
    isAnimating = true;
    const selectedFood = getRandomFood();
    
    // 立即开始翻转
    card.classList.add('flipping');
    text.style.opacity = '0'; // 立即隐藏文字
    
    // 在卡片竖直时更新文本（200ms是翻转到90度的时间点）
    setTimeout(() => {
        text.textContent = selectedFood;
    }, 200);
    
    // 在更新文本后稍微延迟显示
    setTimeout(() => {
        text.style.opacity = '1';
    }, 220);
    
    setTimeout(() => {
        card.classList.remove('flipping');
        lastFood.textContent = `就吃${selectedFood}吧！`;
        
        // 立即播放烟花
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        createFirework(centerX, centerY);
        
        isAnimating = false;
    }, 400);
}

// 使用防抖包装处理点击事件
const debouncedHandleClick = debounce(handleClick, 300);

// 更新 CSS 样式
const style = document.createElement('style');
style.textContent = `
    .firework-particle {
        position: fixed;
        pointer-events: none;
        border-radius: 50%;
        z-index: 999;
    }
    
    .food {
        transition: opacity 0.1s;
    }
`;
document.head.appendChild(style);

// 绑定事件监听器
document.addEventListener('DOMContentLoaded', () => {
    if (card) {
        card.addEventListener('click', debouncedHandleClick);
    }
}); 