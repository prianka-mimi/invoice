<x-app-layout>
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Modern Web Development Invoice</title>
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <!-- Google Fonts -->
        <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Dancing+Script:wght@400;700&display=swap"
            rel="stylesheet">
        <!-- Local CSS -->
        <link rel="stylesheet" href="{{asset('backend/assets')}}/css/style.css">
    </head>

    <body>
        <div class="container">
            <div class="glass-card" id="invoice-to-export">
                <div class="invoice-header">
                    <div class="floating-shape shape-1"></div>
                    <div class="floating-shape shape-2"></div>
                    <div class="header-content">
                        <div class="logo-container">
                            <img src="" alt="Company Logo" class="company-logo" id="company-logo"
                                style="display: none;">
                            <div class="logo-placeholder no-print float" id="logo-placeholder">
                                <i class="fas fa-code"></i>
                            </div>
                            <button class="btn btn-outline btn-sm no-print" id="upload-logo" style="margin-top: 15px;">
                                <i class="fas fa-upload"></i> Upload Logo
                            </button>
                            <input type="file" id="logo-input" accept="image/*" style="display: none;">
                        </div>
                        <h1 contenteditable="true" id="invoice-title">WEB DEVELOPMENT INVOICE</h1>
                        <p>Professional invoice for web development services</p>
                        <div style="margin-top: 25px;">
                            <p style="margin-bottom: 10px;">Invoice #: <input type="text" id="invoice-number"
                                    class="invoice-number-input" placeholder="Auto-generated"></p>
                            <button class="btn btn-warning btn-sm no-print" id="generate-invoice-no">
                                <i class="fas fa-sync-alt"></i> Generate New Number
                            </button>
                        </div>
                    </div>
                </div>

                <div class="invoice-body">
                    <div class="section">
                        <div class="grid-2">
                            <div class="glass-card" style="padding: 25px;">
                                <div class="section-title">
                                    <i class="fas fa-user-tie"></i> From
                                </div>
                                <div class="input-group">
                                    <label>Company Name</label>
                                    <input type="text" id="company-name" placeholder="Your Company Name">
                                </div>
                                <div class="input-group">
                                    <label>Address</label>
                                    <input type="text" id="company-address" placeholder="Company Address">
                                </div>
                                <div class="input-group">
                                    <label>Phone</label>
                                    <input type="text" id="company-phone" placeholder="Company Phone">
                                </div>
                                <div class="input-group">
                                    <label>Email</label>
                                    <input type="email" id="company-email" placeholder="Company Email">
                                </div>
                                <div class="input-group">
                                    <label>Website</label>
                                    <input type="text" id="company-website" placeholder="https://example.com">
                                </div>
                            </div>

                            <div class="glass-card" style="padding: 25px;">
                                <div class="section-title">
                                    <i class="fas fa-user"></i> Bill To
                                </div>
                                <div class="input-group">
                                    <label>Client Name</label>
                                    <input type="text" id="client-name" placeholder="Client Name">
                                </div>
                                <div class="input-group">
                                    <label>Address</label>
                                    <input type="text" id="client-address" placeholder="Client Address">
                                </div>
                                <div class="input-group">
                                    <label>Phone</label>
                                    <input type="text" id="client-phone" placeholder="Client Phone">
                                </div>
                                <div class="input-group">
                                    <label>Email</label>
                                    <input type="email" id="client-email" placeholder="client@example.com">
                                </div>
                                <div class="input-group">
                                    <label>Invoice Date & Time</label>
                                    <div class="datetime-input">
                                        <input type="date" id="invoice-date">
                                        <input type="time" id="invoice-time">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Website Development Package Section -->
                    <div class="section">
                        <div class="glass-card" style="padding: 25px;">
                            <div class="section-title">
                                <i class="fas fa-laptop-code"></i> Website Development Package
                                <button class="btn btn-info btn-sm no-print" style="margin-left: auto;"
                                    onclick="editPackage()">
                                    <i class="fas fa-edit"></i> Edit Package
                                </button>
                            </div>


               <div class="benefits-box" id="features-container">
                                <h3 contenteditable="true">What will be on the website:</h3>
                                <ul class="benefits-list" id="features-list" contenteditable="true">
                                    <li>Modern & Professional Design</li>
                                    <li>Fully Responsive (Mobile, Tablet, Desktop)</li>
                                    <li>Dynamic Admin Panel</li>
                                    <li>Elementor Page Builder Support</li>
                                    <li>Contact Form with Email Notification</li>
                                    <li>WhatsApp/Phone/Email Button Integration</li>
                                    <li>Social Media Integration</li>
                                    <li>SEO Friendly Structure</li>
                                    <li>Speed Optimized</li>
                                    <li>Security Setup</li>
                                    <li>Free Basic Training (How to manage the site)</li>
                                </ul>
                            </div>


            <div class="benefits-box" id="additional-benefits-container">
                                <h3 contenteditable="true">Additional benefits:</h3>
                                <ul class="benefits-list" id="additional-benefits" contenteditable="true">
                                    <li>Free Basic SEO Setup</li>
                                    <li>1 Month Free Technical Support</li>
                                    <li>Paid Plugin or Theme can be used if desired (subject to the client's permission)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="glass-card" style="padding: 25px;">
                            <div class="section-title">
                                <i class="fas fa-receipt"></i> Payment Details
                            </div>
                            <table class="items-table">
                                <thead>
                                    <tr>
                                        <th width="40%">Description</th>
                                        <th width="15%">Amount (৳)</th>
                                        <th width="15%">Discount</th>
                                        <th width="20%">Payment Status</th>
                                        <th width="10%" class="no-print">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="items-container">
                                    <tr>
                                        <td><input type="text" placeholder="Service description" class="item-desc"></td>
                                        <td><input type="number" value="0" min="0" step="0.01" class="item-rate"
                                                oninput="calculatePayments()"></td>
                                        <td>
                                            <div class="grid-2" style="grid-template-columns: 70% 30%; gap: 5px;">
                                                <input type="number" value="0" min="0" max="100" class="item-discount"
                                                    placeholder="%" oninput="calculatePayments()">
                                                <span class="discount-amount">0</span>
                                            </div>
                                        </td>
                                        <td>
                                            <select class="payment-status" onchange="updatePaymentStatus(this)">
                                                <option value="unpaid">Unpaid</option>
                                                <option value="partial">Partially Paid</option>
                                                <option value="full">Fully Paid</option>
                                            </select>
                                            <div class="partial-payment" style="display: none; margin-top: 5px;">
                                                <input type="number" class="partial-payment-input"
                                                    placeholder="Enter Amount" min="0" style="width: 100%;"
                                                    oninput="calculatePayments()">
                                            </div>
                                        </td>
                                        <td class="no-print">
                                            <button class="btn btn-danger btn-sm remove-item"
                                                onclick="removeItem(this)"><i class="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button class="btn btn-primary no-print" id="add-item" onclick="addNewItem()"
                                style="margin-top: 15px;">
                                <i class="fas fa-plus"></i> Add Payment Item
                            </button>
                        </div>
                    </div>

                    <div class="section">
                        <div class="glass-card" style="padding: 25px;">
                            <div class="summary-card">
                                <div class="summary-row">
                                    <span>Subtotal:</span>
                                    <span id="subtotal">0.00</span>
                                </div>
                                <div class="summary-row">
                                    <span>Discount:</span>
                                    <span id="total-discount">0.00</span>
                                </div>
                                <div class="summary-row">
                                    <span>Total After Discount:</span>
                                    <span id="total-after-discount">0.00</span>
                                </div>
                                <div class="summary-row">
                                    <span>Paid Amount:</span>
                                    <span id="paid-amount">0.00</span>
                                </div>
                                <div class="summary-row total">
                                    <span>Balance Due:</span>
                                    <span id="balance-due">0.00</span>
                                </div>
                                <div class="payment-status-container" style="text-align: right; margin-top: 20px;">
                                    <span class="payment-status status-unpaid" id="payment-status-badge">
                                        <i class="fas fa-exclamation-circle"></i> UNPAID
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Completion Section (Visible only to clients) -->
                    <div class="section payment-completion-section" id="payment-completion-section">
                        <div class="glass-card" style="padding: 25px;">
                            <div class="section-title">
                                <i class="fas fa-money-check-alt"></i> Payment Completion
                            </div>


             <div class="payment-details-box">
                                <div class="payment-details-grid">
                                    <div>
                                        <div class="input-group">
                                            <label>Payment Method</label>
                                            <select id="completed-payment-method" required>
                                                <option value="">Select Method</option>
                                                <option value="bkash">Bkash</option>
                                                <option value="nagad">Nagad</option>
                                                <option value="rocket">Rocket</option>
                                                <option value="bank-transfer">Bank Transfer</option>
                                            </select>
                                        </div>
                                        <div class="input-group">
                                            <label>Payment Amount (৳)</label>
                                            <input type="number" id="completed-payment-amount" placeholder="Amount paid"
                                                min="1" required>
                                        </div>
                                        <div class="input-group">
                                            <label>Payment Date</label>
                                            <input type="date" id="completed-payment-date" required>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="input-group">
                                            <label>Transaction Number</label>
                                            <input type="text" id="completed-payment-txn"
                                                placeholder="Transaction number" required>
                                        </div>
                                        <div class="input-group">
                                            <label>Sender Name</label>
                                            <input type="text" id="completed-payment-account-name"
                                                placeholder="Sender's name" required>
                                        </div>
                                        <div class="input-group">
                                            <label>Sender Phone</label>
                                            <input type="text" id="completed-payment-phone"
                                                placeholder="Sender's phone number" required>
                                        </div>
                                    </div>
                                </div>


                  <div class="input-group" style="margin-top: 20px;">
                                    <label>Payment Reference/Notes</label>
                                    <textarea id="completed-payment-notes" rows="2"
                                        placeholder="Any additional payment details"
                                        style="min-height: 100px;"></textarea>
                                </div>
                            </div>


              <div class="action-buttons no-print" style="margin-top: 30px;">
                                <button class="btn btn-success" id="submit-payment">
                                    <i class="fas fa-check-circle"></i> Submit Payment Details
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Information Section -->
                    <div class="section">
                        <div class="glass-card" style="padding: 25px;">
                            <div class="section-title">
                                <i class="fas fa-money-bill-wave"></i> Payment Information
                            </div>


                <div class="payment-details-box">
                                <div class="payment-details-grid">
                                    <!-- Bank Transfer -->
                                    <div>
                                        <div class="term-title" style="color: var(--primary);">Bank Transfer</div>
                                        <div class="input-group">
                                            <label>Bank Name</label>
                                            <input type="text" id="bank-info-name" placeholder="Bank Name"
                                                value="IFIC Bank">
                                        </div>
                                        <div class="input-group">
                                            <label>Account Name</label>
                                            <input type="text" id="bank-info-account-name"
                                                placeholder="Account Holder Name" value="Your Company Name">
                                        </div>
                                        <div class="input-group">
                                            <label>Account Number</label>
                                            <input type="text" id="bank-info-account-number"
                                                placeholder="Account Number" value="123456789">
                                        </div>
                                        <div class="input-group">
                                            <label>Branch</label>
                                            <input type="text" id="bank-info-branch" placeholder="Branch Name"
                                                value="Main Branch">
                                        </div>
                                    </div>


                    <!-- Mobile Banking -->
                                    <div>
                                        <div class="term-title" style="color: var(--primary);">Mobile Banking</div>
                                        <div class="input-group">
                                            <label>Bkash (Payment)</label>
                                            <input type="text" id="mobile-info-bkash" placeholder="Bkash Number"
                                                value="+8801XXXXXXXXX">
                                        </div>
                                        <div class="input-group">
                                            <label>Nagad (Send Money)</label>
                                            <input type="text" id="mobile-info-nagad" placeholder="Nagad Number"
                                                value="+8801XXXXXXXXX">
                                        </div>
                                        <div class="input-group">
                                            <label>Rocket (Send Money)</label>
                                            <input type="text" id="mobile-info-rocket" placeholder="Rocket Number"
                                                value="+8801XXXXXXXXX">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Display Payment Details -->
                    <div id="payment-details-display" class="payment-details-box" style="display: none;">
                        <h3
                            style="color: var(--primary-dark); margin-bottom: 20px; display: flex; align-items: center;">
                            <i class="fas fa-money-check-alt" style="margin-right: 15px;"></i> Payment Details
                        </h3>
                        <div class="payment-details-grid">
                            <div>
                                <div class="detail-row">
                                    <div class="detail-label">Method:</div>
                                    <div class="detail-value" id="display-payment-method"></div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Sender Name:</div>
                                    <div class="detail-value" id="display-account-name"></div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Sender Phone:</div>
                                    <div class="detail-value" id="display-phone-number"></div>
                                </div>
                            </div>
                            <div>
                                <div class="detail-row">
                                    <div class="detail-label">TXN/Account #:</div>
                                    <div class="detail-value" id="display-txn-number"></div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Amount:</div>
                                    <div class="detail-value" id="display-payment-amount"></div>
                                </div>
                                <div class="detail-row">
                                    <div class="detail-label">Date:</div>
                                    <div class="detail-value" id="display-payment-date"></div>
                                </div>
                            </div>
                        </div>
                        <div class="detail-row" id="display-notes-row" style="display: none; margin-top: 15px;">
                            <div class="detail-label">Notes:</div>
                            <div class="detail-value" id="display-payment-notes"></div>
                        </div>
                    </div>

                    <!-- Client Link Section -->
                    <div class="client-link-box no-print">
                        <h3><i class="fas fa-link"></i> Client Payment Status Link</h3>
                        <p style="margin-bottom: 20px; position: relative; z-index: 2;">Share this link with your client
                            to allow them to check payment status and complete payments:</p>
                        <input type="text" id="client-link" class="client-link-input" readonly>
                        <button class="copy-btn" onclick="copyClientLink()" style="margin-top: 15px;">
                            <i class="fas fa-copy"></i> Copy Link
                        </button>
                    </div>

                    <div class="terms-container">
                        <div class="terms-header">
                            <div class="terms-title">
                                <i class="fas fa-file-contract"></i> Terms & Conditions
                            </div>
                            <button class="btn btn-info btn-sm no-print" onclick="editTerms()">
                                <i class="fas fa-edit"></i> Edit Terms
                            </button>
                        </div>
                        <div class="terms-content" id="terms-content">
                            <div class="term-item">
                                <div class="term-title"><i class="fas fa-money-bill-wave"></i> Payment Terms</div>
                                <div class="term-desc">A total amount must be paid to complete the project. 40% payment
                                    must be made before starting work, and the remaining 60% payment must be made at the
                                    time of submission of work.</div>
                            </div>
                            <div class="term-item">
                                <div class="term-title"><i class="fas fa-code"></i> Modification Policy</div>
                                <div class="term-desc">After the full delivery of the website, if the owner or any third
                                    party attempts to modify the website (code, design, or content) and any issues
                                    arise, such as errors, malfunctions, or data loss, the developer and development
                                    team will not be held responsible.</div>
                            </div>
                            <div class="term-item">
                                <div class="term-title"><i class="fas fa-plus-circle"></i> Additional Work</div>
                                <div class="term-desc">If any additional work is required after the project is handed
                                    over, you will have to pay extra again.</div>
                            </div>
                            <div class="term-highlight">
                                <div class="term-title"><i class="fas fa-lightbulb"></i> Recommendation</div>
                                <div class="term-desc">For the website's safety and stability, please consult us before
                                    making any changes.</div>
                            </div>
                        </div>
                        <textarea id="terms-textarea"
                            style="display: none; width: 100%; min-height: 300px; margin-top: 15px; padding: 20px; border-radius: var(--radius); border: 1px solid var(--border); font-family: 'Poppins', sans-serif;"></textarea>
                    </div>

                    <div class="signature-box">
                        <div class="signature-placeholder" id="signature-canvas">
                            <span class="no-print" style="font-style: italic; color: var(--gray);">Signature will appear
                                here</span>
                        </div>
                        <input type="text" id="signature-name" placeholder="Signer Name"
                            style="text-align: center; border: none; border-bottom: 1px solid var(--border); padding: 8px; width: 300px; font-size: 1rem; font-family: 'Poppins', sans-serif;">
                        <button class="btn btn-primary btn-sm no-print" id="add-signature" style="margin-top: 20px;">
                            <i class="fas fa-signature"></i> Add Signature
                        </button>
                    </div>

                    <div class="action-buttons no-print">
                        <button class="btn btn-success" id="save-invoice"><i class="fas fa-save"></i> Save
                            Invoice</button>
                        <button class="btn btn-primary" id="print-invoice"><i class="fas fa-print"></i> Print
                            Invoice</button>
                        <button class="btn btn-primary" id="download-pdf"><i class="fas fa-file-pdf"></i> Download
                            PDF</button>
                        <button class="btn btn-danger" id="clear-form"><i class="fas fa-trash"></i> Clear Form</button>
                        <button class="btn btn-info" id="view-as-client"><i class="fas fa-eye"></i> View as
                            Client</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- JS Libraries -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
        <!-- Local JS -->
        <script src="{{asset('backend/assets')}}/js/main.js"></script>
    </body>

    </html>
</x-app-layout>
