
        // Dashboard functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Refresh button functionality
            const refreshBtn = document.querySelector('.refresh-btn');
            refreshBtn.addEventListener('click', function() {
                // Add loading state
                refreshBtn.textContent = 'Refreshing...';
                refreshBtn.disabled = true;
                
                // Simulate refresh
                setTimeout(() => {
                    refreshBtn.textContent = 'Refresh';
                    refreshBtn.disabled = false;
                    console.log('Dashboard refreshed');
                }, 1000);
            });
            
            // Connection status simulation
            const connectionStatus = document.querySelector('.connection-status');
            let isConnected = true;
            
            setInterval(() => {
                isConnected = !isConnected;
                const statusIcon = connectionStatus.querySelector('.status-icon');
                const statusText = connectionStatus.querySelector('.status-text');
                
                if (isConnected) {
                    statusIcon.textContent = '📶';
                    statusText.textContent = 'Connected';
                    connectionStatus.style.color = '#22c55e';
                } else {
                    statusIcon.textContent = '📵';
                    statusText.textContent = 'Disconnected';
                    connectionStatus.style.color = '#ef4444';
                }
            }, 10000); // Toggle every 10 seconds for demo
            
            // Animate metric cards on load
            const metricCards = document.querySelectorAll('.metric-card');
            metricCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
        