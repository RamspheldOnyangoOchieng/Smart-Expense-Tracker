// Fetch user-specific transactions dynamically
async function fetchTransactions() {
    try {
        const response = await fetch('/api/transactions'); // Backend API endpoint for transactions
        if (!response.ok) throw new Error('Failed to fetch transactions');

        const transactions = await response.json();
        return transactions; // Array of transactions
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return []; // Return an empty array on error
    }
}

// Fetch dashboard metrics dynamically
async function fetchMetrics() {
    try {
        const response = await fetch('/api/metrics'); // Backend API endpoint for metrics
        if (!response.ok) throw new Error('Failed to fetch metrics');

        const metrics = await response.json();
        return metrics; // Object containing metrics (e.g., total expenses, savings, budget)
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return {
            totalExpenses: 0,
            remainingBudget: 0,
            totalSavings: 0,
        }; // Return default values on error
    }
}

// Logout function
function logoutUser() {
    fetch('/api/logout', { method: 'POST' }) // Adjust endpoint for logging out
        .then(response => {
            if (response.ok) {
                window.location.href = '/login'; // Redirect to login page
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => console.error('Error during logout:', error));
}

// Attach logout event listener
function setupLogoutListener() {
    const logoutButton = document.querySelector('#logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }
}

// Populate transactions table dynamically
async function populateTransactions() {
    const transactions = await fetchTransactions();
    const tableBody = document.querySelector('#transactions-table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    if (transactions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">No transactions found.</td></tr>';
        return;
    }

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td>${transaction.category}</td>
            <td>$${transaction.amount}</td>
            <td>${transaction.paymentMethod}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Populate dashboard metrics dynamically
async function populateMetrics() {
    const metrics = await fetchMetrics();

    document.getElementById('total-expenses').textContent = `$${metrics.totalExpenses.toFixed(2)}`;
    document.getElementById('remaining-budget').textContent = `$${metrics.remainingBudget.toFixed(2)}`;
    document.getElementById('total-savings').textContent = `$${metrics.totalSavings.toFixed(2)}`;
}

// Filter transactions based on user input
async function filterTransactions() {
    const searchInput = document.querySelector('#search').value.toLowerCase();
    const categoryFilter = document.querySelector('#category-filter').value;

    const allTransactions = await fetchTransactions();
    const filteredTransactions = allTransactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchInput) || transaction.category.toLowerCase().includes(searchInput);
        const matchesCategory = categoryFilter ? transaction.category === categoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    const tableBody = document.querySelector('#transactions-table tbody');
    tableBody.innerHTML = ''; // Clear previous rows

    if (filteredTransactions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">No transactions found.</td></tr>';
        return;
    }

    filteredTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.description}</td>
            <td>${transaction.category}</td>
            <td>$${transaction.amount}</td>
            <td>${transaction.paymentMethod}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Render analytics charts
function renderCharts(transactions) {
    const expenseChartCanvas = document.getElementById('expense-chart');
    const spendingTrendsCanvas = document.getElementById('spending-trends');

    // Expense Pie Chart
    const expenseCategories = [...new Set(transactions.map(tx => tx.category))];
    const expenseData = expenseCategories.map(category => {
        return transactions
            .filter(tx => tx.category === category)
            .reduce((sum, tx) => sum + tx.amount, 0);
    });

    new Chart(expenseChartCanvas, {
        type: 'pie',
        data: {
            labels: expenseCategories,
            datasets: [{
                data: expenseData,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            }],
        },
    });

    // Spending Trends Line Chart
    const dates = [...new Set(transactions.map(tx => tx.date))].sort();
    const spendingData = dates.map(date => {
        return transactions
            .filter(tx => tx.date === date)
            .reduce((sum, tx) => sum + tx.amount, 0);
    });

    new Chart(spendingTrendsCanvas, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Spending Over Time',
                data: spendingData,
                borderColor: '#36A2EB',
                fill: false,
            }],
        },
    });
}

// Event listener setup for filtering and interaction
function setupEventListeners() {
    const searchInput = document.querySelector('#search');
    const categoryFilter = document.querySelector('#category-filter');

    searchInput.addEventListener('input', filterTransactions);
    categoryFilter.addEventListener('change', filterTransactions);
}

// Initialize dashboard on page load
async function initializeDashboard() {
    await populateMetrics();
    const transactions = await fetchTransactions();
    populateTransactions();
    renderCharts(transactions);
    setupEventListeners();
    setupLogoutListener();
}

// Call initialization when DOM content is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);
