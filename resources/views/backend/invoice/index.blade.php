<x-app-layout>
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice List</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        <style>
            :root {
                --primary-purple: #5A43E6;
                --light-purple: #F3F1FF;
                --green: #2ecc71;
                --light-green: #e9f9f0;
                --text-color: #333;
                --border-color: #ddd;
                --shadow-color: rgba(0, 0, 0, 0.1);
                --button-hover-bg: #4c32e0;
                --table-row-bg: #fff;
                /* Changed from #fff to a variable */
                --main-bg-color: #f7f9fc;
                /* Changed main body background color */
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                /* background-color: var(--main-bg-color); */
                /* Updated background color */
                padding: 20px;
                color: var(--text-color);
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
                /* background-color: var(--table-row-bg); */
                /* Still using white for the container for a clean look */
                border-radius: 12px;
                /* box-shadow: 0 4px 20px var(--shadow-color); */
                padding: 25px;
            }

            /* Header section with search and add button */
            .table-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                margin-bottom: 20px;
                gap: 15px;
            }

            .search-box {
                position: relative;
                flex-grow: 1;
            }

            .search-box input {
                width: 100%;
                padding: 12px 15px 12px 40px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                font-size: 16px;
                transition: all 0.3s ease;
            }

            .search-box input:focus {
                outline: none;
                border-color: var(--primary-purple);
                box-shadow: 0 0 0 3px rgba(90, 67, 230, 0.2);
            }

            .search-box .search-icon {
                position: absolute;
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #999;
            }

            .add-button {
                padding: 12px 25px;
                background-color: var(--primary-purple);
                color: #fff;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 0.3s ease, transform 0.2s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .add-button:hover {
                background-color: var(--button-hover-bg);
                transform: translateY(-2px);
            }

            .add-button:active {
                transform: translateY(0);
            }

            /* Table styles */
            .invoice-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0 10px;
            }

            .invoice-table thead th,
            .invoice-table tbody td {
                padding: 15px;
                text-align: left;
                white-space: nowrap;
            }

            .invoice-table thead th {
                color: #777;
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
                border-bottom: 2px solid #f0f0f0;
            }

            .invoice-table tbody tr {
                background-color: var(--table-row-bg);
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                border: 1px solid #e0e0e0;
                /* Added a subtle border to each row */
            }

            .invoice-table tbody tr:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
            }

            /* Checkbox styling */
            .checkbox-container {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .checkbox-container input[type="checkbox"] {
                width: 18px;
                height: 18px;
                cursor: pointer;
                accent-color: var(--primary-purple);
                border-radius: 4px;
                /* Added border-radius */
            }

            /* Table cell styling */
            .invoice-table tbody tr td:first-child {
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
            }

            .invoice-table tbody tr td:last-child {
                border-top-right-radius: 8px;
                border-bottom-right-radius: 8px;
            }

            .invoice-table .serial-number {
                font-weight: 500;
                color: #777;
            }

            .invoice-table .invoice-id {
                color: var(--primary-purple);
                font-weight: 600;
            }

            .invoice-table .invoice-status {
                padding: 5px 10px;
                border-radius: 50px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .invoice-table .status-paid {
                background-color: var(--light-green);
                color: var(--green);
            }

            .invoice-table .status-pending {
                background-color: #fcebeb;
                color: #e74c3c;
            }

            .invoice-table .status-draft {
                background-color: #fdf6e6;
                color: #f39c12;
            }

            /* Action buttons styling */
            .invoice-table .action-buttons {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 15px;
            }

            .invoice-table .action-buttons .action-icon {
                font-size: 18px;
                color: #999;
                cursor: pointer;
                transition: color 0.2s ease, transform 0.2s ease;
            }

            .invoice-table .action-buttons .action-icon:hover {
                color: var(--primary-purple);
                transform: scale(1.1);
            }

            /* Media query for smaller screens */
            @media (max-width: 768px) {
                .table-header {
                    flex-direction: column;
                    align-items: stretch;
                }

                .add-button {
                    width: 100%;
                    justify-content: center;
                }

                .invoice-table {
                    display: block;
                    overflow-x: auto;
                }
            }
        </style>
    </head>

    <body>

        <div class="container">
            <div class="table-header">
                <div class="search-box">
                    <span class="search-icon"><i class="fas fa-search"></i></span>
                    <input type="text" placeholder="Search here..." />
                </div>
                <a href="{{ route('invoice.create') }}">
                    <button class="add-button" type="button">
                        <i class="fas fa-plus"></i>
                        <span>Add New Invoice</span>
                    </button>
                </a>
            </div>

            <table class="invoice-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" id="selectAll"></th>
                        <th>Serial</th>
                        <th>Invoice ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="checkbox"></td>
                        <td class="serial-number">1</td>
                        <td class="invoice-id">#WEB-202508-964</td>
                        <td>Farjana Akhter</td>
                        <td>farjana@example.com</td>
                        <td>23 Aug 2025</td>
                        <td>$1,200.00</td>
                        <td><span class="invoice-status status-paid">Paid</span></td>
                        <td class="action-buttons">
                            <i class="fas fa-print action-icon" title="Print"></i>
                            <i class="fas fa-eye action-icon" title="View"></i>
                            <i class="fas fa-edit action-icon" title="Edit"></i>
                            <i class="fas fa-trash-alt action-icon" title="Delete"></i>
                        </td>
                    </tr>

                    <tr>
                        <td><input type="checkbox"></td>
                        <td class="serial-number">2</td>
                        <td class="invoice-id">#WEB-202508-965</td>
                        <td>Shafin Ahmed</td>
                        <td>shafin@example.com</td>
                        <td>24 Aug 2025</td>
                        <td>$850.00</td>
                        <td><span class="invoice-status status-paid">Paid</span></td>
                        <td class="action-buttons">
                            <i class="fas fa-print action-icon" title="Print"></i>
                            <i class="fas fa-eye action-icon" title="View"></i>
                            <i class="fas fa-edit action-icon" title="Edit"></i>
                            <i class="fas fa-trash-alt action-icon" title="Delete"></i>
                        </td>
                    </tr>

                    <tr>
                        <td><input type="checkbox"></td>
                        <td class="serial-number">3</td>
                        <td class="invoice-id">#WEB-202508-966</td>
                        <td>Samia Jahan</td>
                        <td>samia@example.com</td>
                        <td>25 Aug 2025</td>
                        <td>$450.00</td>
                        <td><span class="invoice-status status-pending">Pending</span></td>
                        <td class="action-buttons">
                            <i class="fas fa-print action-icon" title="Print"></i>
                            <i class="fas fa-eye action-icon" title="View"></i>
                            <i class="fas fa-edit action-icon" title="Edit"></i>
                            <i class="fas fa-trash-alt action-icon" title="Delete"></i>
                        </td>
                    </tr>

                    <tr>
                        <td><input type="checkbox"></td>
                        <td class="serial-number">4</td>
                        <td class="invoice-id">#WEB-202508-967</td>
                        <td>Sohel Hasan</td>
                        <td>sohel@example.com</td>
                        <td>25 Aug 2025</td>
                        <td>$500.00</td>
                        <td><span class="invoice-status status-draft">Draft</span></td>
                        <td class="action-buttons">
                            <i class="fas fa-print action-icon" title="Print"></i>
                            <i class="fas fa-eye action-icon" title="View"></i>
                            <i class="fas fa-edit action-icon" title="Edit"></i>
                            <i class="fas fa-trash-alt action-icon" title="Delete"></i>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', (event) => {
                const selectAllCheckbox = document.getElementById('selectAll');
                const individualCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');

                selectAllCheckbox.addEventListener('change', (e) => {
                    for (let checkbox of individualCheckboxes) {
                        checkbox.checked = e.target.checked;
                    }
                });

                for (let checkbox of individualCheckboxes) {
                    checkbox.addEventListener('change', () => {
                        if (!checkbox.checked) {
                            selectAllCheckbox.checked = false;
                        } else {
                            let allChecked = true;
                            for (let c of individualCheckboxes) {
                                if (!c.checked) {
                                    allChecked = false;
                                    break;
                                }
                            }
                            if (allChecked) {
                                selectAllCheckbox.checked = true;
                            }
                        }
                    });
                }
            });
        </script>

    </body>

    </html>
</x-app-layout>
