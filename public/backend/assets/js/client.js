// Initialize jsPDF
    const { jsPDF } = window.jspdf;
    
    document.addEventListener('DOMContentLoaded', function() {
      // Check for invoice number in URL
      const urlParams = new URLSearchParams(window.location.search);
      const invoiceNumber = urlParams.get('invoice');
      
      if (invoiceNumber) {
        document.getElementById('invoice-lookup-input').value = invoiceNumber;
        lookupInvoice();
      }
      
      // Set up lookup button
      document.getElementById('lookup-invoice').addEventListener('click', lookupInvoice);
      
      // Set up payment submission
      document.getElementById('submit-payment').addEventListener('click', submitPayment);
      
      // Set today's date as default for payment date
      const today = new Date();
      const formattedDate = today.toISOString().substr(0, 10);
      document.getElementById('payment-date').value = formattedDate;
      
      // Set up print button
      document.getElementById('print-invoice').addEventListener('click', function() {
        window.print();
      });
      
      // Set up PDF download button
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
          
          pdf.save(`invoice_${document.getElementById('client-invoice-number').textContent}.pdf`);
          
          // Restore buttons after PDF generation
          buttons.forEach(btn => btn.style.display = '');
        });
      });
    });
    
    // Look up invoice details
    function lookupInvoice() {
      const invoiceNumber = document.getElementById('invoice-lookup-input').value.trim();
      
      if (!invoiceNumber) {
        document.getElementById('lookup-error').style.display = 'block';
        return;
      }
      
      // Check localStorage for saved invoice
      const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '{}');
      const invoiceData = savedInvoices[invoiceNumber];
      
      if (invoiceData) {
        // Display invoice details
        displayInvoiceDetails(invoiceData);
        document.getElementById('lookup-error').style.display = 'none';
        document.getElementById('lookup-section').style.display = 'none';
        document.getElementById('invoice-details-section').style.display = 'block';
        
        // Scroll to details
        document.getElementById('invoice-details-section').scrollIntoView({ behavior: 'smooth' });
      } else {
        document.getElementById('lookup-error').style.display = 'block';
      }
    }
    
    // Display invoice details
    function displayInvoiceDetails(invoiceData) {
      // Basic info
      document.getElementById('client-invoice-title').textContent = invoiceData.title;
      document.getElementById('client-invoice-number').textContent = invoiceData.number;
      
      // Company info
      document.getElementById('client-company-name').textContent = invoiceData.company.name;
      document.getElementById('client-company-address').textContent = invoiceData.company.address;
      document.getElementById('client-company-phone').textContent = invoiceData.company.phone;
      document.getElementById('client-company-email').textContent = invoiceData.company.email;
      document.getElementById('client-company-website').textContent = invoiceData.company.website || 'N/A';
      
      // Load logo if exists
      if (invoiceData.company.logo) {
        const logoImg = document.getElementById('client-company-logo');
        logoImg.src = invoiceData.company.logo;
        logoImg.style.display = 'block';
        document.getElementById('default-logo-icon').style.display = 'none';
      }
      
      // Client info
      document.getElementById('client-name').textContent = invoiceData.client.name;
      document.getElementById('client-address').textContent = invoiceData.client.address;
      document.getElementById('client-phone').textContent = invoiceData.client.phone;
      document.getElementById('client-email').textContent = invoiceData.client.email || 'N/A';
      document.getElementById('client-invoice-date').textContent = invoiceData.date;
      
      // Features and benefits
      document.getElementById('client-features-list').innerHTML = invoiceData.features;
      document.getElementById('client-benefits-list').innerHTML = invoiceData.benefits;
      
      // Items
      const itemsContainer = document.getElementById('client-items-container');
      itemsContainer.innerHTML = '';
      
      invoiceData.items.forEach(item => {
        const status = item.status;
        let statusText = '';
        let paidAmount = '0.00';
        
        if (status === 'full') {
          statusText = 'Fully Paid';
          paidAmount = parseFloat(item.amount) - (parseFloat(item.amount) * (parseFloat(item.discount) / 100));
        } 
        else if (status === 'partial') {
          statusText = 'Partially Paid';
          paidAmount = item.partialAmount || '0.00';
        }
        else {
          statusText = 'Unpaid';
        }
        
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td>${item.description}</td>
          <td>${parseFloat(item.amount).toFixed(2)}</td>
          <td>${statusText}</td>
          <td>${parseFloat(paidAmount).toFixed(2)}</td>
        `;
        itemsContainer.appendChild(newRow);
      });
      
      // Bank details
      if (invoiceData.bankDetails) {
        document.getElementById('bank-info-name').textContent = invoiceData.bankDetails.ific.accountName;
        document.getElementById('bank-info-account-name').textContent = invoiceData.bankDetails.ific.accountName;
        document.getElementById('bank-info-account-number').textContent = invoiceData.bankDetails.ific.accountNumber;
        document.getElementById('bank-info-branch').textContent = invoiceData.bankDetails.ific.branch;
        
        document.getElementById('mobile-info-bkash').textContent = invoiceData.bankDetails.bkash;
        document.getElementById('mobile-info-nagad').textContent = invoiceData.bankDetails.nagad;
        document.getElementById('mobile-info-rocket').textContent = invoiceData.bankDetails.rocket;
      }
      
      // Terms
      if (invoiceData.terms) {
        document.getElementById('client-terms-content').textContent = invoiceData.terms;
      }
      
      // Totals
      document.getElementById('client-subtotal').textContent = invoiceData.totals.subtotal;
      document.getElementById('client-discount').textContent = invoiceData.totals.discount;
      document.getElementById('client-total').textContent = invoiceData.totals.total;
      document.getElementById('client-paid').textContent = invoiceData.totals.paid;
      document.getElementById('client-due').textContent = invoiceData.totals.due;
      
      // Payment status
      const statusBadge = document.getElementById('client-payment-status');
      if (invoiceData.totals.due === '0.00') {
        statusBadge.className = 'payment-status status-paid';
        statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> FULLY PAID';
        document.getElementById('paid-stamp').style.display = 'block';
        document.getElementById('payment-form-section').style.display = 'none';
      } 
      else if (invoiceData.totals.paid !== '0.00') {
        statusBadge.className = 'payment-status status-partial';
        statusBadge.innerHTML = '<i class="fas fa-exclamation-circle"></i> PARTIALLY PAID';
        document.getElementById('paid-stamp').style.display = 'none';
        document.getElementById('payment-form-section').style.display = 'block';
      }
      else {
        statusBadge.className = 'payment-status status-unpaid';
        statusBadge.innerHTML = '<i class="fas fa-exclamation-circle"></i> UNPAID';
        document.getElementById('paid-stamp').style.display = 'none';
        document.getElementById('payment-form-section').style.display = 'block';
      }
      
      // Set payment amount to balance due
      const balanceDue = parseFloat(invoiceData.totals.due.replace(/,/g, ''));
      document.getElementById('payment-amount').value = balanceDue.toFixed(2);
      
      // Show payment details if payment was made
      if (invoiceData.paymentDetails) {
        displayPaymentDetails(invoiceData.paymentDetails);
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
      document.getElementById('display-payment-amount').textContent = `৳${parseFloat(paymentDetails.amount).toFixed(2)}`;
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
    
    // Submit payment details
    function submitPayment() {
      // Validate all required fields
      const paymentMethod = document.getElementById('payment-method').value;
      const accountName = document.getElementById('payment-account-name').value;
      const txnNumber = document.getElementById('payment-txn').value;
      const paymentAmount = parseFloat(document.getElementById('payment-amount').value);
      const paymentDate = document.getElementById('payment-date').value;
      const phoneNumber = document.getElementById('payment-phone').value;
      
      if (!paymentMethod || !accountName || !txnNumber || !paymentAmount || !paymentDate || !phoneNumber) {
        alert('Please fill all required payment details');
        return;
      }
      
      const invoiceNumber = document.getElementById('client-invoice-number').textContent;
      const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '{}');
      
      if (savedInvoices[invoiceNumber]) {
        // Store payment details
        const paymentDetails = {
          method: paymentMethod,
          accountName: accountName,
          txnNumber: txnNumber,
          amount: paymentAmount,
          date: paymentDate,
          phone: phoneNumber,
          notes: document.getElementById('payment-notes').value || ''
        };
        
        savedInvoices[invoiceNumber].paymentDetails = paymentDetails;
        
        // Calculate payment percentage
        const totalAmount = parseFloat(savedInvoices[invoiceNumber].totals.total.replace(/,/g, ''));
        const paymentPercentage = (paymentAmount / totalAmount) * 100;
        
        // Update payment status based on amount paid
        if (paymentAmount >= totalAmount) {
          // Full payment
          savedInvoices[invoiceNumber].paymentDetails.status = 'paid';
          savedInvoices[invoiceNumber].totals.paid = totalAmount.toFixed(2);
          savedInvoices[invoiceNumber].totals.due = '0.00';
          savedInvoices[invoiceNumber].totals.status = 'FULLY PAID';
          
          // Update all items to fully paid
          savedInvoices[invoiceNumber].items.forEach(item => {
            item.status = 'full';
          });
        } else {
          // Partial payment
          savedInvoices[invoiceNumber].paymentDetails.status = 'partial';
          const newPaid = parseFloat(savedInvoices[invoiceNumber].totals.paid.replace(/,/g, '')) + paymentAmount;
          savedInvoices[invoiceNumber].totals.paid = newPaid.toFixed(2);
          savedInvoices[invoiceNumber].totals.due = (totalAmount - newPaid).toFixed(2);
          savedInvoices[invoiceNumber].totals.status = 'PARTIALLY PAID';
          
          // Update first unpaid item to partial payment
          for (let item of savedInvoices[invoiceNumber].items) {
            if (item.status !== 'full') {
              item.status = 'partial';
              item.partialAmount = paymentAmount;
              break;
            }
          }
        }
        
        // Save to localStorage
        localStorage.setItem('savedInvoices', JSON.stringify(savedInvoices));
        
        // Display updated invoice
        displayInvoiceDetails(savedInvoices[invoiceNumber]);
        
        alert('Payment details submitted successfully!\n\n' +
              `Paid: ৳${paymentAmount.toFixed(2)}\n` +
              `Remaining: ৳${(totalAmount - paymentAmount).toFixed(2)}`);
      } else {
        alert('Invoice not found! Please try again.');
      }
    }