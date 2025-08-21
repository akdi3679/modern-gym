document.addEventListener('DOMContentLoaded', function() {
  // Panel toggle functionality
  const buttons = document.querySelectorAll('.action-btn');
  const panels = document.querySelectorAll('.panel-overlay');
  const closeButtons = document.querySelectorAll('.panel-close');
  
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const panelId = this.getAttribute('data-panel');
      document.getElementById(panelId).style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      if (panelId === 'padel-game') {
        initPadelGame();
      } else if (panelId === 'color-game') {
        initColorGame();
      }
    });
  });
  
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      closePanel(this.closest('.panel-overlay'));
    });
  });
  
  panels.forEach(panel => {
    panel.addEventListener('click', function(e) {
      if (e.target === this) {
        closePanel(this);
      }
    });
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      panels.forEach(panel => {
        if (panel.style.display === 'flex') {
          closePanel(panel);
        }
      });
    }
  });

  function closePanel(panel) {
    panel.style.display = 'none';
    document.body.style.overflow = '';
    
    if (panel.id === 'padel-game') {
      stopPadelGame();
    } else if (panel.id === 'color-game') {
      stopColorGame();
    }
  }

  // PADEL GAME - Proper Breakout Implementation
  let padelGame = {
    canvas: null,
    ctx: null,
    animationId: null,
    gameRunning: false,
    
    // Game objects
    ball: {
      x: 0,
      y: 0,
      dx: 3,
      dy: -3,
      radius: 8,
      speed: 3
    },
    
    paddle: {
      x: 0,
      y: 0,
      width: 100,
      height: 12,
      speed: 7
    },
    
    bricks: [],
    
    // Game state
    score: 0,
    lives: 3,
    gameOver: false,
    gameWon: false,
    
    // Brick settings
    brickRows: 5,
    brickCols: 10,
    brickWidth: 0,
    brickHeight: 20,
    brickPadding: 4,
    brickOffsetTop: 40,
    brickOffsetLeft: 35,
    
    // Input
    keys: {
      left: false,
      right: false
    }
  };

  function initPadelGame() {
    const canvas = document.getElementById("padelCanvas");
    if (!canvas) return;
    
    padelGame.canvas = canvas;
    padelGame.ctx = canvas.getContext("2d");
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Calculate brick width
    padelGame.brickWidth = (canvas.width - (padelGame.brickOffsetLeft * 2) - 
                           (padelGame.brickCols - 1) * padelGame.brickPadding) / padelGame.brickCols;
    
    // Reset game
    resetPadelGame();
    
    // Event listeners
    document.addEventListener("keydown", padelKeyDown);
    document.addEventListener("keyup", padelKeyUp);
    canvas.addEventListener("mousemove", padelMouseMove);
    
    // Control buttons
    document.getElementById('padelRestart')?.addEventListener('click', resetPadelGame);
    document.getElementById('padelClose')?.addEventListener('click', function() {
      closePanel(document.getElementById('padel-game'));
    });
    
    // Start game
    startPadelGame();
  }

  function resetPadelGame() {
    const canvas = padelGame.canvas;
    if (!canvas) return;
    
    // Reset ball
    padelGame.ball.x = canvas.width / 2;
    padelGame.ball.y = canvas.height - 80;
    padelGame.ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
    padelGame.ball.dy = -3;
    
    // Reset paddle
    padelGame.paddle.x = (canvas.width - padelGame.paddle.width) / 2;
    padelGame.paddle.y = canvas.height - 30;
    
    // Reset game state
    padelGame.score = 0;
    padelGame.lives = 3;
    padelGame.gameOver = false;
    padelGame.gameWon = false;
    
    // Reset input
    padelGame.keys.left = false;
    padelGame.keys.right = false;
    
    // Create bricks
    createBricks();
    
    hideGameMessage();
  
  // Restart game
  startPadelGame();
  }

  function createBricks() {
  padelGame.bricks = [];
  
  // Make bricks slightly bigger
  padelGame.brickHeight = 25; // Increased from 20
  
  for (let r = 0; r < padelGame.brickRows; r++) {
    for (let c = 0; c < padelGame.brickCols; c++) {
      const brick = {
        x: c * (padelGame.brickWidth + padelGame.brickPadding) + padelGame.brickOffsetLeft,
        y: r * (padelGame.brickHeight + padelGame.brickPadding) + padelGame.brickOffsetTop,
        width: padelGame.brickWidth,
        height: padelGame.brickHeight,
        visible: true,
        color: '#000000' // All bricks black
      };
      padelGame.bricks.push(brick);
    }
  }
}
  function startPadelGame() {
    padelGame.gameRunning = true;
    gameLoop();
  }

  function stopPadelGame() {
    padelGame.gameRunning = false;
    if (padelGame.animationId) {
      cancelAnimationFrame(padelGame.animationId);
    }
  }

  function gameLoop() {
    if (!padelGame.gameRunning) return;
    
    update();
    draw();
    
    padelGame.animationId = requestAnimationFrame(gameLoop);
  }

  function update() {
    if (padelGame.gameOver || padelGame.gameWon) return;
    
    const canvas = padelGame.canvas;
    const ball = padelGame.ball;
    const paddle = padelGame.paddle;
    
    // Update paddle position
    if (padelGame.keys.left && paddle.x > 0) {
      paddle.x -= paddle.speed;
    }
    if (padelGame.keys.right && paddle.x < canvas.width - paddle.width) {
      paddle.x += paddle.speed;
    }
    
    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
    }
    
    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
    }
    
    // Ball collision with paddle
    if (ball.y + ball.radius > paddle.y && 
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.x > paddle.x && 
        ball.x < paddle.x + paddle.width) {
      
      // Calculate bounce angle based on where ball hits paddle
      const hitPos = (ball.x - paddle.x) / paddle.width;
      const angle = (hitPos - 0.5) * Math.PI / 3; // Max 60 degrees
      
      const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
      ball.dx = speed * Math.sin(angle);
      ball.dy = -Math.abs(speed * Math.cos(angle));
    }
    
    // Ball collision with bricks
    for (let i = 0; i < padelGame.bricks.length; i++) {
      const brick = padelGame.bricks[i];
      if (!brick.visible) continue;
      
      if (ball.x + ball.radius > brick.x && 
          ball.x - ball.radius < brick.x + brick.width &&
          ball.y + ball.radius > brick.y && 
          ball.y - ball.radius < brick.y + brick.height) {
        
        ball.dy = -ball.dy;
        brick.visible = false;
        padelGame.score += 10;
        
        // Check win condition
        if (padelGame.bricks.every(b => !b.visible)) {
          padelGame.gameWon = true;
          showGameMessage("YOU WIN!", true);
          setTimeout(resetPadelGame, 2000);
        }
        break;
      }
    }
    
    // Ball falls off screen
    if (ball.y > canvas.height) {
      padelGame.lives--;
      
      if (padelGame.lives <= 0) {
        padelGame.gameOver = true;
        showGameMessage("GAME OVER", false);
      } else {
        // Reset ball position
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 80;
        ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = -3;
      }
    }
  }

  function draw() {
    const ctx = padelGame.ctx;
    const canvas = padelGame.canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bricks
   // In the draw() function, replace the brick drawing code with:
padelGame.bricks.forEach(brick => {
  if (brick.visible) {
    const ctx = padelGame.ctx;
    const radius = 5; // Corner radius
    
    ctx.beginPath();
    ctx.moveTo(brick.x + radius, brick.y);
    ctx.lineTo(brick.x + brick.width - radius, brick.y);
    ctx.quadraticCurveTo(brick.x + brick.width, brick.y, brick.x + brick.width, brick.y + radius);
    ctx.lineTo(brick.x + brick.width, brick.y + brick.height - radius);
    ctx.quadraticCurveTo(brick.x + brick.width, brick.y + brick.height, brick.x + brick.width - radius, brick.y + brick.height);
    ctx.lineTo(brick.x + radius, brick.y + brick.height);
    ctx.quadraticCurveTo(brick.x, brick.y + brick.height, brick.x, brick.y + brick.height - radius);
    ctx.lineTo(brick.x, brick.y + radius);
    ctx.quadraticCurveTo(brick.x, brick.y, brick.x + radius, brick.y);
    ctx.closePath();
    
    ctx.fillStyle = brick.color;
    ctx.fill();
    
    // Brick border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
});
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(padelGame.ball.x, padelGame.ball.y, padelGame.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.closePath();
     
    // Draw paddle
    ctx.fillStyle = '#333';
    ctx.fillRect(padelGame.paddle.x, padelGame.paddle.y, padelGame.paddle.width, padelGame.paddle.height);
    
    // Draw UI
    
  }
function showGameMessage(text, isWin) {
  const finalScoreEl = document.getElementById('padelFinalScore');
  if (finalScoreEl) finalScoreEl.textContent = padelGame.score;
  
  const endScreen = document.querySelector('#padel-game .game-end-screen');
  if (endScreen) {
    endScreen.style.display = 'flex';
    endScreen.querySelector('h3').textContent = isWin ? 'You Win!' : 'Game Over';
  }
  
  stopPadelGame();
}

function hideGameMessage() {
  const endScreen = document.querySelector('#padel-game .game-end-screen');
  if (endScreen) endScreen.style.display = 'none';
}

// Add event listener for play again button
document.getElementById('padelPlayAgain')?.addEventListener('click', function() {
  resetPadelGame();
  hideGameMessage();
});

  function padelKeyDown(e) {
    if (e.key === 'ArrowLeft' || e.key === 'Left') {
      padelGame.keys.left = true;
    }
    if (e.key === 'ArrowRight' || e.key === 'Right') {
      padelGame.keys.right = true;
    }
  }

  function padelKeyUp(e) {
    if (e.key === 'ArrowLeft' || e.key === 'Left') {
      padelGame.keys.left = false;
    }
    if (e.key === 'ArrowRight' || e.key === 'Right') {
      padelGame.keys.right = false;
    }
  }

  function padelMouseMove(e) {
    const canvas = padelGame.canvas;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    padelGame.paddle.x = mouseX - padelGame.paddle.width / 2;
    
    // Keep paddle within bounds
    if (padelGame.paddle.x < 0) padelGame.paddle.x = 0;
    if (padelGame.paddle.x > canvas.width - padelGame.paddle.width) {
      padelGame.paddle.x = canvas.width - padelGame.paddle.width;
    }
  }

  // COLOR GAME - Proper Stroop Test Implementation
  let colorGame = {
    gameActive: false,
    score: 0,
    lives: 3,
    currentQuestion: null,
    questionTimer: null,
    questionTimeout: 5000,
    
    colors: [
      { name: 'red', hex: '#E74C3C' },
      { name: 'blue', hex: '#3498DB' },
      { name: 'green', hex: '#2ECC71' },
      { name: 'yellow', hex: '#F1C40F' },
      { name: 'purple', hex: '#9B59B6' },
      { name: 'orange', hex: '#E67E22' }
    ],
    
    elements: {
      question: null,
      colorText: null,
      yesBtn: null,
      noBtn: null,
      scoreDisplay: null,
      livesDisplay: null,
      timerBar: null,
      timeDisplay: null,
      gameArea: null,
      endScreen: null,
      finalScore: null,
      playAgainBtn: null
    }
  };

  function initColorGame() {
    // Get elements
    colorGame.elements.question = document.getElementById('js-colour-meaning');
    colorGame.elements.colorText = document.getElementById('js-colour-text');
    colorGame.elements.yesBtn = document.getElementById('js-btn-yes');
    colorGame.elements.noBtn = document.getElementById('js-btn-no');
    colorGame.elements.scoreDisplay = document.getElementById('js-score-count');
    colorGame.elements.livesDisplay = document.getElementById('js-lives-count');
    colorGame.elements.timerBar = document.getElementById('js-timer-bar');
    colorGame.elements.timeDisplay = document.getElementById('js-time-left');
    colorGame.elements.endScreen = document.getElementById('color-game-end');
    colorGame.elements.finalScore = document.getElementById('final-score');
    colorGame.elements.playAgainBtn = document.getElementById('js-play-again');
    
    // Event listeners
    colorGame.elements.yesBtn?.addEventListener('click', () => handleAnswer(true));
    colorGame.elements.noBtn?.addEventListener('click', () => handleAnswer(false));
    colorGame.elements.playAgainBtn?.addEventListener('click', startColorGame);
    
    startColorGame();
  }

 function startColorGame() {
  colorGame.gameActive = true;
  colorGame.score = 0;
  colorGame.lives = 3;
  canAnswer = true;
  
  // Hide end screen
  const endScreen = document.querySelector('#color-game .game-end-screen');
  if (endScreen) endScreen.style.display = 'none';
  
  updateUI();
  nextQuestion();
}
  function stopColorGame() {
    colorGame.gameActive = false;
    clearTimeout(colorGame.questionTimer);
  }

  let questionCount = 0;

function nextQuestion() {
  if (!colorGame.gameActive) return;
  
  clearTimeout(colorGame.questionTimer);
  questionCount++;
  
  // Generate question
  const textColor = colorGame.colors[Math.floor(Math.random() * colorGame.colors.length)];
  const displayColor = colorGame.colors[Math.floor(Math.random() * colorGame.colors.length)];
  
  colorGame.currentQuestion = {
    textColor: textColor,
    displayColor: displayColor,
    correct: textColor.name === displayColor.name
  };
  
  // Update display
  if (colorGame.elements.question) {
    colorGame.elements.question.textContent = `Is this text ${textColor.name}?`;
  }
  
  if (colorGame.elements.colorText) {
    colorGame.elements.colorText.textContent = displayColor.name;
    colorGame.elements.colorText.style.color = displayColor.hex;
  }
  
  // Start timer
  startQuestionTimer();
}

 function startQuestionTimer() {
  let timeLeft = colorGame.questionTimeout;
  
  function updateTimer() {
    timeLeft -= 100;
    const percentage = (timeLeft / colorGame.questionTimeout) * 100;
    const seconds = Math.ceil(timeLeft / 1000);
    
    if (colorGame.elements.timerBar) {
      colorGame.elements.timerBar.style.width = percentage + '%';
    }
    
    if (colorGame.elements.timeDisplay) {
      colorGame.elements.timeDisplay.textContent = seconds;
    }
    
    if (timeLeft <= 0) {
      handleAnswer(null); // Timeout = wrong answer
    } else {
      colorGame.questionTimer = setTimeout(updateTimer, 100);
    }
  }
  
  updateTimer();
}

// Add event listener for play again button
document.getElementById('js-play-again')?.addEventListener('click', startColorGame);

  let canAnswer = true; // Flag to prevent double clicking

function handleAnswer(userAnswer) {
  if (!colorGame.gameActive || !canAnswer) return;
  
  canAnswer = false; // Disable further answers
  clearTimeout(colorGame.questionTimer);
  
  let correct = false;
  
  if (userAnswer === true && colorGame.currentQuestion.correct) {
    correct = true;
  } else if (userAnswer === false && !colorGame.currentQuestion.correct) {
    correct = true;
  }
  
  // Show feedback
  const feedbackEl = document.getElementById('js-feedback');
  if (feedbackEl) {
    feedbackEl.textContent = correct ? '✓ Correct! +10' : '✗ Wrong! -1 Life';
    feedbackEl.className = 'feedback ' + (correct ? 'correct' : 'wrong');
    feedbackEl.classList.add('show');
    
    setTimeout(() => {
      feedbackEl.classList.remove('show');
    }, 1000);
  }
  
  if (correct) {
    colorGame.score += 10;
  } else {
    colorGame.lives--;
  }
  
  updateUI();
  
  if (colorGame.lives <= 0) {
    setTimeout(endGame, 1000);
  } else {
    setTimeout(() => {
      canAnswer = true; // Re-enable answering
      nextQuestion();
    }, 1000);
  }
}
  function showFeedback(message, isCorrect) {
    const feedbackEl = document.getElementById(isCorrect ? 'js-feedback-correct' : 'js-feedback-wrong');
    if (feedbackEl) {
      feedbackEl.textContent = message;
      feedbackEl.classList.add('is-active');
      
      setTimeout(() => {
        feedbackEl.classList.remove('is-active');
      }, 1000);
    }
  }

  function updateUI() {
    if (colorGame.elements.scoreDisplay) {
      colorGame.elements.scoreDisplay.textContent = colorGame.score;
    }
    
    if (colorGame.elements.livesDisplay) {
      colorGame.elements.livesDisplay.textContent = colorGame.lives;
    }
  }

 function endGame() {
  const finalScoreEl = document.getElementById('final-score');
  if (finalScoreEl) finalScoreEl.textContent = colorGame.score;
  
  const endScreen = document.querySelector('#color-game .game-end-screen');
  if (endScreen) endScreen.style.display = 'flex';
  
  colorGame.gameActive = false;
  clearTimeout(colorGame.questionTimer);
}
}); 