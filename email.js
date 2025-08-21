const copyEmailBtn = document.getElementById('copyEmailBtn');
const emailAddress = 'contact@example.com'; // Replace with your actual email

copyEmailBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  // Create temporary input element
  const tempInput = document.createElement('input');
  tempInput.value = emailAddress;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  
  // Visual feedback
  const originalText = copyEmailBtn.textContent;
  copyEmailBtn.textContent = 'Copied!';
  
  // Reset after 2 seconds
  setTimeout(() => {
    copyEmailBtn.textContent = originalText;
  }, 2000);
});