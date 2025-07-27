// Initialize jsPDF
    const { jsPDF } = window.jspdf;
    
    document.addEventListener('DOMContentLoaded', function() {
      // Set today's date and time as default
      const today = new Date();
      const formattedDate = today.toISOString().substr(0, 10);
      const hours = today.getHours().toString().padStart(2, '0');
      const minutes = today.getMinutes().toString().padStart(2, '0');
      
      document.getElementById('invoice-date').value = formattedDate;
      document.getElementById('invoice-time').value = `${hours}:${minutes}`;
      document.getElementById('completed-payment-date').value = formattedDate;
      
      // Generate initial invoice number
      generateInvoiceNumber();
      
      // Generate new invoice number when clicked
      document.getElementById('generate-invoice-no').addEventListener('click', generateInvoiceNumber);
      
      // Allow custom invoice number
      document.getElementById('invoice-number').addEventListener('change', function() {
        if (this.value.trim() === '') {
          generateInvoiceNumber();
        }
      });
      
      // Initialize calculations
      calculatePayments();
      
      // Load saved invoice if exists
      loadSavedInvoice();
      
      // Update client link
      updateClientLink();
      
      // Set up payment completion button
      document.getElementById('submit-payment').addEventListener('click', submitPaymentDetails);
      
      // Set up logo upload
      document.getElementById('upload-logo').addEventListener('click', function() {
        document.getElementById('logo-input').click();
      });
      
      document.getElementById('logo-input').addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = function(event) {
            const logoImg = document.getElementById('company-logo');
            logoImg.src = event.target.result;
            logoImg.style.display = 'block';
            document.getElementById('logo-placeholder').style.display = 'none';
          };
          reader.readAsDataURL(e.target.files[0]);
        }
      });
      
      // Set up signature
      document.getElementById('add-signature').addEventListener('click', function() {
        const name = prompt('Enter signer name:', document.getElementById('signature-name').value);
        if (name) {
          document.getElementById('signature-name').value = name;
          document.getElementById('signature-canvas').innerHTML = `
            <span style="font-family: 'Dancing Script', cursive; font-size: 2rem;">${name}</span>
          `;
        }
      });
      
      // Set up view as client button
      document.getElementById('view-as-client').addEventListener('click', function() {
        const invoiceNumber = document.getElementById('invoice-number').value;
        if (!invoiceNumber) {
          alert('Please save the invoice first');
          return;
        }
        window.open(`client.html?invoice=${encodeURIComponent(invoiceNumber)}`, '_blank');
      });
    });
    
    // Generate invoice number
    function generateInvoiceNumber() {
      const now = new Date();
      const randomNum = Math.floor(Math.random() * 1000);
      const invoiceNumber = `WEB-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}-${randomNum.toString().padStart(3, '0')}`;
      document.getElementById('invoice-number').value = invoiceNumber;
      updateClientLink();
    }

    // Update client payment status link
    function updateClientLink() {
      const invoiceNumber = document.getElementById('invoice-number').value;
      const clientLink = `${window.location.href.split('?')[0].replace('index.html', 'client.html')}?invoice=${encodeURIComponent(invoiceNumber)}`;
      document.getElementById('client-link').value = clientLink;
    }
    
    // Copy client link to clipboard
    function copyClientLink() {
      const clientLink = document.getElementById('client-link');
      clientLink.select();
      document.execCommand('copy');
      
      // Show tooltip
      const btn = document.querySelector('.copy-btn');
      btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-copy"></i> Copy Link';
      }, 2000);
    }
    
    // Edit package function
    function editPackage() {
      const featuresContainer = document.getElementById('features-container');
      const benefitsContainer = document.getElementById('additional-benefits-container');
      
      // Toggle contenteditable for all elements
      const toggleEditable = (container, isEditable) => {
        const elements = container.querySelectorAll('h3, ul, li');
        elements.forEach(el => {
          el.contentEditable = isEditable;
          if (isEditable) {
            el.style.border = '1px dashed #ccc';
            el.style.padding = '10px';
            el.style.borderRadius = '8px';
            el.style.backgroundColor = 'rgba(255,255,255,0.7)';
          } else {
            el.style.border = 'none';
            el.style.padding = '0';
            el.style.backgroundColor = 'transparent';
          }
        });
      };
      
      if (featuresContainer.querySelector('h3').style.border) {
        // Currently in edit mode - save changes
        toggleEditable(featuresContainer, false);
        toggleEditable(benefitsContainer, false);
        document.querySelector('.section-title button').innerHTML = '<i class="fas fa-edit"></i> Edit Package';
      } else {
        // Enter edit mode
        toggleEditable(featuresContainer, true);
        toggleEditable(benefitsContainer, true);
        document.querySelector('.section-title button').innerHTML = '<i class="fas fa-save"></i> Save Package';
      }
    }
    
    // Add new payment item
    function addNewItem() {
      const itemsContainer = document.getElementById('items-container');
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><input type="text" placeholder="Item description" class="item-desc" oninput="calculatePayments()"></td>
        <td><input type="number" value="0" min="0" step="0.01" class="item-rate" oninput="calculatePayments()"></td>
        <td>
          <div class="grid-2" style="grid-template-columns: 70% 30%; gap: 5px;">
            <input type="number" value="0" min="0" max="100" class="item-discount" placeholder="%" oninput="calculatePayments()">
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
            <input type="number" class="partial-payment-input" placeholder="Enter Amount" min="0" style="width: 100%;" oninput="calculatePayments()">
          </div>
        </td>
        <td class="no-print">
          <button class="btn btn-danger btn-sm remove-item" onclick="removeItem(this)"><i class="fas fa-trash"></i></button>
        </td>
      `;
      itemsContainer.appendChild(newRow);
      calculatePayments();
    }
    
    // Remove payment item
    function removeItem(button) {
      if (confirm('Are you sure you want to remove this item?')) {
        button.closest('tr').remove();
        calculatePayments();
      }
    }
    
    // Update payment status UI
    function updatePaymentStatus(select) {
      const partialPaymentDiv = select.parentElement.querySelector('.partial-payment');
      if (select.value === 'partial') {
        partialPaymentDiv.style.display = 'block';
      } else {
        partialPaymentDiv.style.display = 'none';
      }
      calculatePayments();
    }
    
    // Calculate all payment totals
    function calculatePayments() {
      let subtotal = 0;
      let totalDiscount = 0;
      let paidAmount = 0;
      let isFullyPaid = true;
      let hasPartialPayment = false;
      
      // Calculate item amounts
      document.querySelectorAll('#items-container tr').forEach(row => {
        const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
        const discount = parseFloat(row.querySelector('.item-discount').value) || 0;
        const discountAmount = rate * (discount / 100);
        const discountedAmount = rate - discountAmount;
        
        // Update discount amount display
        row.querySelector('.discount-amount').textContent = formatCurrency(discountAmount);
        
        subtotal += rate;
        totalDiscount += discountAmount;
        
        // Calculate paid amount based on status
        const statusSelect = row.querySelector('.payment-status');
        const status = statusSelect.value;
        
        if (status === 'unpaid') {
          isFullyPaid = false;
        } 
        else if (status === 'partial') {
          const partialAmount = parseFloat(row.querySelector('.partial-payment-input').value) || 0;
          paidAmount += partialAmount;
          if (partialAmount < discountedAmount) {
            isFullyPaid = false;
            hasPartialPayment = true;
          }
        }
        else if (status === 'full') {
          paidAmount += discountedAmount;
        }
      });
      
      const totalAfterDiscount = subtotal - totalDiscount;
      const balanceDue = totalAfterDiscount - paidAmount;
      
      // Update summary
      document.getElementById('subtotal').textContent = formatCurrency(subtotal);
      document.getElementById('total-discount').textContent = formatCurrency(totalDiscount);
      document.getElementById('total-after-discount').textContent = formatCurrency(totalAfterDiscount);
      document.getElementById('paid-amount').textContent = formatCurrency(paidAmount);
      document.getElementById('balance-due').textContent = formatCurrency(balanceDue);
      
      // Update payment status badge based on balance due
      const statusBadge = document.getElementById('payment-status-badge');
      if (balanceDue <= 0) {
        statusBadge.className = 'payment-status status-paid';
        statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> FULLY PAID';
        showPaidStamp();
      } 
      else if (paidAmount > 0) {
        statusBadge.className = 'payment-status status-partial';
        statusBadge.innerHTML = '<i class="fas fa-exclamation-circle"></i> PARTIALLY PAID';
        hidePaidStamp();
      }
      else {
        statusBadge.className = 'payment-status status-unpaid';
        statusBadge.innerHTML = '<i class="fas fa-exclamation-circle"></i> UNPAID';
        hidePaidStamp();
      }
    }
    
    // Show paid stamp
    function showPaidStamp() {
      let stamp = document.querySelector('.paid-stamp');
      if (!stamp) {
        stamp = document.createElement('div');
        stamp.className = 'paid-stamp print-only';
        stamp.textContent = 'PAID';
        document.querySelector('.invoice-header').appendChild(stamp);
      }
      stamp.style.display = 'block';
    }
    
    // Hide paid stamp
    function hidePaidStamp() {
      const stamp = document.querySelector('.paid-stamp');
      if (stamp) {
        stamp.style.display = 'none';
      }
    }
    
    // Format currency with commas
    function formatCurrency(amount) {
      return parseFloat(amount || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Edit terms and conditions
    function editTerms() {
      const termsContent = document.getElementById('terms-content');
      const termsTextarea = document.getElementById('terms-textarea');
      
      if (termsTextarea.style.display === 'none') {
        // Switch to edit mode
        termsTextarea.value = `
• Payment Terms
A total amount must be paid to complete the project. 40% payment must be made before starting work, and the remaining 60% payment must be made at the time of submission of work.

• Modification Policy
After the full delivery of the website, if the owner or any third party attempts to modify the website (code, design, or content) and any issues arise, such as errors, malfunctions, or data loss, the developer and development team will not be held responsible.

• Additional Work
If any additional work is required after the project is handed over, you will have to pay extra again.

• Recommendation
For the website's safety and stability, please consult us before making any changes.
        `.trim();
        
        termsContent.style.display = 'none';
        termsTextarea.style.display = 'block';
        document.querySelector('.terms-header button').innerHTML = '<i class="fas fa-save"></i> Save Terms';
      } else {
        // Save and render new terms
        const termsText = termsTextarea.value;
        renderTerms(document.getElementById('terms-content'), termsText);
        
        termsContent.style.display = 'block';
        termsTextarea.style.display = 'none';
        document.querySelector('.terms-header button').innerHTML = '<i class="fas fa-edit"></i> Edit Terms';
      }
    }
    
    // Submit payment details
    function submitPaymentDetails() {
      // Validate all required fields
      const paymentMethod = document.getElementById('completed-payment-method').value;
      const accountName = document.getElementById('completed-payment-account-name').value;
      const txnNumber = document.getElementById('completed-payment-txn').value;
      const paymentAmount = parseFloat(document.getElementById('completed-payment-amount').value);
      const paymentDate = document.getElementById('completed-payment-date').value;
      const phoneNumber = document.getElementById('completed-payment-phone').value;
      
      if (!paymentMethod || !accountName || !txnNumber || !paymentAmount || !paymentDate || !phoneNumber) {
        alert('Please fill all required payment details');
        return;
      }
      
      const totalAmount = parseFloat(document.getElementById('total-after-discount').textContent.replace(/,/g, ''));
      
      // Save payment details
      const invoiceNumber = document.getElementById('invoice-number').value;
      let savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '{}');
      
      if (savedInvoices[invoiceNumber]) {
        // Store payment details
        const paymentDetails = {
          method: paymentMethod,
          accountName: accountName,
          txnNumber: txnNumber,
          amount: paymentAmount,
          date: paymentDate,
          phone: phoneNumber,
          notes: document.getElementById('completed-payment-notes').value || ''
        };
        
        savedInvoices[invoiceNumber].paymentDetails = paymentDetails;
        
        // Calculate payment percentage
        const paymentPercentage = (paymentAmount / totalAmount) * 100;
        
        // Update payment status based on amount paid
        if (paymentAmount >= totalAmount) {
          // Full payment
          document.querySelectorAll('.payment-status').forEach(select => {
            select.value = 'full';
            updatePaymentStatus(select);
          });
          savedInvoices[invoiceNumber].paymentDetails.status = 'paid';
        } else {
          // Partial payment
          document.querySelectorAll('.payment-status').forEach(select => {
            select.value = 'partial';
            updatePaymentStatus(select);
            select.parentElement.querySelector('.partial-payment-input').value = paymentAmount;
          });
          savedInvoices[invoiceNumber].paymentDetails.status = 'partial';
        }
        
        // Save to localStorage
        localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));
        
        // Display payment details
        displayPaymentDetails(savedInvoices[invoiceNumber].paymentDetails);
        
        // Recalculate payments
        calculatePayments();
        
        alert('Payment details submitted successfully!\n\n' +
              `Paid: ৳${paymentAmount.toFixed(2)}\n` +
              `Remaining: ৳${(totalAmount - paymentAmount).toFixed(2)}`);
      } else {
        alert('Invoice not found! Please save the invoice first.');
      }
    }
    
    // Display payment details
    function displayPaymentDetails(paymentDetails) {
      let methodText = paymentDetails.method;
      if (paymentDetails.method === 'bank-transfer') {
        methodText = 'Bank Transfer';
      }
      methodText = methodText.toUpperCase();
      
      document.getElementById('display-payment-method').textContent = methodText;
      document.getElementById('display-account-name').textContent = paymentDetails.accountName;
      document.getElementById('display-txn-number').textContent = paymentDetails.txnNumber;
      document.getElementById('display-payment-amount').textContent = `৳${formatCurrency(paymentDetails.amount)}`;
      document.getElementById('display-payment-date').textContent = paymentDetails.date;
      document.getElementById('display-phone-number').textContent = paymentDetails.phone || 'N/A';
      
      if (paymentDetails.notes) {
        document.getElementById('display-payment-notes').textContent = paymentDetails.notes;
        document.getElementById('display-notes-row').style.display = 'flex';
      } else {
        document.getElementById('display-notes-row').style.display = 'none';
      }
      
      document.getElementById('payment-details-display').style.display = 'block';
    }
    
    // Save invoice to localStorage
    document.getElementById('save-invoice').addEventListener('click', function() {
      const invoiceData = {
        title: document.getElementById('invoice-title').textContent,
        number: document.getElementById('invoice-number').value,
        company: {
          name: document.getElementById('company-name').value,
          address: document.getElementById('company-address').value,
          phone: document.getElementById('company-phone').value,
          email: document.getElementById('company-email').value,
          website: document.getElementById('company-website').value,
          logo: document.getElementById('company-logo').src || ''
        },
        client: {
          name: document.getElementById('client-name').value,
          address: document.getElementById('client-address').value,
          phone: document.getElementById('client-phone').value,
          email: document.getElementById('client-email').value
        },
        date: document.getElementById('invoice-date').value,
        time: document.getElementById('invoice-time').value,
        features: document.getElementById('features-list').innerHTML,
        benefits: document.getElementById('additional-benefits').innerHTML,
        items: Array.from(document.querySelectorAll('#items-container tr')).map(row => ({
          description: row.querySelector('.item-desc').value,
          amount: row.querySelector('.item-rate').value,
          discount: row.querySelector('.item-discount').value,
          status: row.querySelector('.payment-status').value,
          partialAmount: row.querySelector('.partial-payment-input') ? row.querySelector('.partial-payment-input').value : '0'
        })),
        bankDetails: {
          ific: {
            accountName: document.getElementById('bank-info-account-name').value,
            accountNumber: document.getElementById('bank-info-account-number').value,
            branch: document.getElementById('bank-info-branch').value
          },
          bkash: document.getElementById('mobile-info-bkash').value,
          rocket: document.getElementById('mobile-info-rocket').value,
          nagad: document.getElementById('mobile-info-nagad').value
        },
        terms: document.getElementById('terms-textarea').value || document.getElementById('terms-content').innerText,
        signature: document.getElementById('signature-name').value,
        totals: {
          subtotal: document.getElementById('subtotal').textContent,
          discount: document.getElementById('total-discount').textContent,
          total: document.getElementById('total-after-discount').textContent,
          paid: document.getElementById('paid-amount').textContent,
          due: document.getElementById('balance-due').textContent,
          status: document.getElementById('payment-status-badge').textContent.trim()
        }
      };
      
      // Include payment details if they exist
      const invoiceNumber = document.getElementById('invoice-number').value;
      const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '{}');
      
      if (savedInvoices[invoiceNumber] && savedInvoices[invoiceNumber].paymentDetails) {
        invoiceData.paymentDetails = savedInvoices[invoiceNumber].paymentDetails;
      }
      
      // Save to localStorage
      savedInvoices[invoiceData.number] = invoiceData;
      localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));
      
      alert('Invoice saved successfully! You can check payment status anytime with the invoice number.');
      updateClientLink();
    });
    
    // Load saved invoice if exists
    function loadSavedInvoice() {
      const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '{}');
      const invoiceNumber = document.getElementById('invoice-number').value;
      
      if (savedInvoices[invoiceNumber]) {
        const invoiceData = savedInvoices[invoiceNumber];
        
        document.getElementById('invoice-title').textContent = invoiceData.title;
        document.getElementById('invoice-number').value = invoiceData.number;
        
        // Company info
        document.getElementById('company-name').value = invoiceData.company.name;
        document.getElementById('company-address').value = invoiceData.company.address;
        document.getElementById('company-phone').value = invoiceData.company.phone;
        document.getElementById('company-email').value = invoiceData.company.email;
        document.getElementById('company-website').value = invoiceData.company.website || '';
        
        // Load logo if exists
        if (invoiceData.company.logo) {
          const logoImg = document.getElementById('company-logo');
          logoImg.src = invoiceData.company.logo;
          logoImg.style.display = 'block';
          document.getElementById('logo-placeholder').style.display = 'none';
        }
        
        // Client info
        document.getElementById('client-name').value = invoiceData.client.name;
        document.getElementById('client-address').value = invoiceData.client.address;
        document.getElementById('client-phone').value = invoiceData.client.phone;
        document.getElementById('client-email').value = invoiceData.client.email || '';
        document.getElementById('invoice-date').value = invoiceData.date;
        document.getElementById('invoice-time').value = invoiceData.time || '';
        
        // Features and benefits
        document.getElementById('features-list').innerHTML = invoiceData.features;
        document.getElementById('additional-benefits').innerHTML = invoiceData.benefits;
        
        // Items
        const itemsContainer = document.getElementById('items-container');
        itemsContainer.innerHTML = '';
        
        invoiceData.items.forEach(item => {
          const newRow = document.createElement('tr');
          newRow.innerHTML = `
            <td><input type="text" value="${item.description}" class="item-desc" oninput="calculatePayments()"></td>
            <td><input type="number" value="${item.amount}" min="0" step="0.01" class="item-rate" oninput="calculatePayments()"></td>
            <td>
              <div class="grid-2" style="grid-template-columns: 70% 30%; gap: 5px;">
                <input type="number" value="${item.discount}" min="0" max="100" class="item-discount" placeholder="%" oninput="calculatePayments()">
                <span class="discount-amount">${formatCurrency(item.amount * (item.discount / 100))}</span>
              </div>
            </td>
            <td>
              <select class="payment-status" onchange="updatePaymentStatus(this)">
                <option value="unpaid" ${item.status === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                <option value="partial" ${item.status === 'partial' ? 'selected' : ''}>Partially Paid</option>
                <option value="full" ${item.status === 'full' ? 'selected' : ''}>Fully Paid</option>
              </select>
              <div class="partial-payment" style="display: ${item.status === 'partial' ? 'block' : 'none'}; margin-top: 5px;">
                <input type="number" class="partial-payment-input" placeholder="Enter Amount" min="0" style="width: 100%;" 
                  value="${item.partialAmount || 0}" oninput="calculatePayments()">
              </div>
            </td>
            <td class="no-print">
              <button class="btn btn-danger btn-sm remove-item" onclick="removeItem(this)"><i class="fas fa-trash"></i></button>
            </td>
          `;
          itemsContainer.appendChild(newRow);
        });
        
        // Bank details
        if (invoiceData.bankDetails) {
          document.getElementById('bank-info-name').value = invoiceData.bankDetails.ific.accountName;
          document.getElementById('bank-info-account-name').value = invoiceData.bankDetails.ific.accountName;
          document.getElementById('bank-info-account-number').value = invoiceData.bankDetails.ific.accountNumber;
          document.getElementById('bank-info-branch').value = invoiceData.bankDetails.ific.branch;
          
          document.getElementById('mobile-info-bkash').value = invoiceData.bankDetails.bkash;
          document.getElementById('mobile-info-nagad').value = invoiceData.bankDetails.nagad;
          document.getElementById('mobile-info-rocket').value = invoiceData.bankDetails.rocket;
        }
        
        // Terms
        if (invoiceData.terms) {
          document.getElementById('terms-textarea').value = invoiceData.terms;
          renderTerms(document.getElementById('terms-content'), invoiceData.terms);
        }
        
        // Payment details if exists
        if (invoiceData.paymentDetails) {
          document.getElementById('completed-payment-method').value = invoiceData.paymentDetails.method;
          document.getElementById('completed-payment-account-name').value = invoiceData.paymentDetails.accountName;
          document.getElementById('completed-payment-txn').value = invoiceData.paymentDetails.txnNumber;
          document.getElementById('completed-payment-amount').value = invoiceData.paymentDetails.amount;
          document.getElementById('completed-payment-date').value = invoiceData.paymentDetails.date;
          document.getElementById('completed-payment-phone').value = invoiceData.paymentDetails.phone || '';
          document.getElementById('completed-payment-notes').value = invoiceData.paymentDetails.notes || '';
          
          // Display payment details
          displayPaymentDetails(invoiceData.paymentDetails);
        }
        
        calculatePayments();
      }
    }
    
    // Clear form
    document.getElementById('clear-form').addEventListener('click', function() {
      if (confirm('Are you sure you want to clear the entire invoice?')) {
        document.getElementById('invoice-title').textContent = 'WEB DEVELOPMENT INVOICE';
        document.getElementById('company-name').value = '';
        document.getElementById('company-address').value = '';
        document.getElementById('company-phone').value = '';
        document.getElementById('company-email').value = '';
        document.getElementById('company-website').value = '';
        
        // Reset logo
        document.getElementById('company-logo').src = '';
        document.getElementById('company-logo').style.display = 'none';
        document.getElementById('logo-placeholder').style.display = 'flex';
        
        document.getElementById('client-name').value = '';
        document.getElementById('client-address').value = '';
        document.getElementById('client-phone').value = '';
        document.getElementById('client-email').value = '';
        
        const today = new Date();
        const formattedDate = today.toISOString().substr(0, 10);
        const hours = today.getHours().toString().padStart(2, '0');
        const minutes = today.getMinutes().toString().padStart(2, '0');
        
        document.getElementById('invoice-date').value = formattedDate;
        document.getElementById('invoice-time').value = `${hours}:${minutes}`;
        document.getElementById('completed-payment-date').value = formattedDate;
        
        document.getElementById('features-list').innerHTML = `
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
        `;
        document.getElementById('additional-benefits').innerHTML = `
          <li>Free Basic SEO Setup</li>
          <li>1 Month Free Technical Support</li>
          <li>Paid Plugin or Theme can be used if desired (subject to the client's permission)</li>
        `;
        document.getElementById('items-container').innerHTML = '';
        
        // Reset bank details
        document.getElementById('bank-info-name').value = '';
        document.getElementById('bank-info-account-name').value = '';
        document.getElementById('bank-info-account-number').value = '';
        document.getElementById('bank-info-branch').value = '';
        
        document.getElementById('mobile-info-bkash').value = '';
        document.getElementById('mobile-info-nagad').value = '';
        document.getElementById('mobile-info-rocket').value = '';
        
        document.getElementById('terms-textarea').value = `
• Payment Terms
A total amount must be paid to complete the project. 40% payment must be made before starting work, and the remaining 60% payment must be made at the time of submission of work.

• Modification Policy
After the full delivery of the website, if the owner or any third party attempts to modify the website (code, design, or content) and any issues arise, such as errors, malfunctions, or data loss, the developer and development team will not be held responsible.

• Additional Work
If any additional work is required after the project is handed over, you will have to pay extra again.

• Recommendation
For the website's safety and stability, please consult us before making any changes.
        `.trim();
        renderTerms(document.getElementById('terms-content'), document.getElementById('terms-textarea').value);
        document.getElementById('signature-name').value = '';
        document.getElementById('signature-canvas').innerHTML = '<span class="no-print" style="font-style: italic; color: var(--gray);">Signature will appear here</span>';
        
        // Clear payment details
        document.getElementById('completed-payment-method').value = '';
        document.getElementById('completed-payment-account-name').value = '';
        document.getElementById('completed-payment-txn').value = '';
        document.getElementById('completed-payment-amount').value = '';
        document.getElementById('completed-payment-date').value = formattedDate;
        document.getElementById('completed-payment-phone').value = '';
        document.getElementById('completed-payment-notes').value = '';
        document.getElementById('payment-details-display').style.display = 'none';
        
        generateInvoiceNumber();
        
        // Add default item
        addNewItem();
        
        calculatePayments();
      }
    });
    
    // Download PDF
    document.getElementById('download-pdf').addEventListener('click', function() {
      // Temporarily hide buttons for PDF export
      const buttons = document.querySelectorAll('.no-print');
      buttons.forEach(btn => btn.style.display = 'none');
      
      // Create PDF
      const element = document.getElementById('invoice-to-export');
      html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save(`web_development_invoice_${document.getElementById('invoice-number').value}.pdf`);
        
        // Restore buttons after PDF generation
        buttons.forEach(btn => btn.style.display = '');
      });
    });
    
    // Print invoice
    document.getElementById('print-invoice').addEventListener('click', function() {
      window.print();
    });