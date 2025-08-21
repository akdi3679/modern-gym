document.querySelectorAll('.join-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    // Remove active class from all tabs
    document.querySelectorAll('.join-tab').forEach(t => t.classList.remove('active'));
    
    // Add active class to clicked tab
    this.classList.add('active');
    
    // Get which tab to show
    const tabToShow = this.dataset.tab;
    
    // Hide all forms
    document.querySelectorAll('.join-form').forEach(form => {
      form.classList.remove('active');
    });
    
    // Show the selected form
    document.getElementById(tabToShow + 'Form').classList.add('active');
  });
});