// Fetch transactions dynamically
async function fetchTransactions() {
    try {
        const response = await fetch('/api/transactions'); // Update API endpoint
        if (!response.ok) throw new Error('Failed to fetch transactions');

        return await response.json(); // Return transactions from backend
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return []; // Return empty array if there's an error
    }
}

// Populate transactions in the table
async function populateTransactions() {
    const transactions = await fetchTransactions();
    const tableBody = document.querySelector('#transactions-table tbody');
    tableBody.innerHTML = ''; // Clear previous rows

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
            <td>$${transaction.amount.toFixed(2)}</td>
            <td>${transaction.paymentMethod}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Filter transactions based on search and category
async function filterTransactions() {
    const searchValue = document.querySelector('#search').value.toLowerCase();
    const categoryFilter = document.querySelector('#category-filter').value;

    const transactions = await fetchTransactions();
    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchValue) || transaction.category.toLowerCase().includes(searchValue);
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
            <td>$${transaction.amount.toFixed(2)}</td>
            <td>${transaction.paymentMethod}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Logout user
function logoutUser() {
    fetch('/api/logout', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                window.location.href = '/login'; // Redirect to login
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => console.error('Error during logout:', error));
}

// Set up event listeners
function setupEventListeners() {
    document.querySelector('#search').addEventListener('input', filterTransactions);
    document.querySelector('#category-filter').addEventListener('change', filterTransactions);
    document.querySelector('#logout-button').addEventListener('click', logoutUser);
}

// Initialize transactions page
async function initializeTransactionsPage() {
    await populateTransactions();
    setupEventListeners();
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', initializeTransactionsPage);
