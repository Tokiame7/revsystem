function showSection(sectionId) {
    // Hide all sections
    let sections = document.querySelectorAll('.section');
    sections.forEach(function (section) {
        section.style.display = 'none';
    });

    // Show the selected section
    let selectedSection = document.getElementById(sectionId);
    selectedSection.style.display = 'block';
}

// Query Reservation
function queryReservation() {
    let custName = document.getElementById('custName').value;
    fetch(`http://localhost:8080/api/reservations?custName=${custName}`)
        .then(response => response.json())
        .then(data => {
            let results = document.getElementById('queryResults');
            results.innerHTML = '';
            data.forEach(reservation => {
                results.innerHTML += `
                    <p>客户: ${reservation.custName}, 预订类型: ${reservation.resvType}, 预订编号: ${reservation.resvKey}</p>
                `;
            });
        })
        .catch(error => console.error('查询失败:', error));
}

// Insert Reservation
function insertReservation() {
    let custName = document.getElementById('insertCustName').value;
    let resvType = document.getElementById('insertResvType').value;
    let resvKey = document.getElementById('insertResvKey').value;

    let data = {
        custName: custName,
        resvType: resvType,
        resvKey: resvKey
    };

    fetch('http://localhost:8080/api/reservations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => alert('插入成功'))
        .catch(error => console.error('插入失败:', error));
}

// Update Reservation
function updateReservation() {
    let custName = document.getElementById('updateCustName').value;
    let resvType = document.getElementById('updateResvType').value;
    let resvKey = document.getElementById('updateResvKey').value;

    let data = {
        custName: custName,
        resvType: resvType,
        resvKey: resvKey
    };

    fetch('http://localhost:8080/api/reservations/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => alert('更新成功'))
        .catch(error => console.error('更新失败:', error));
}

// Delete Reservation
function deleteReservation() {
    let resvKey = document.getElementById('deleteResvKey').value;

    fetch(`http://localhost:8080/api/reservations/${resvKey}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => alert('删除成功'))
        .catch(error => console.error('删除失败:', error));
}

// Query Customer Info
function queryCustomerInfo() {
    let custName = document.getElementById('customerInfoName').value;

    fetch(`http://localhost:8080/api/detailed-travel-info?custName=${custName}`)
        .then(response => response.json())
        .then(data => {
            let results = document.getElementById('customerInfoResults');
            results.innerHTML = '';
            data.forEach(info => {
                results.innerHTML += `
                    <p>${info.Customer}: ${info.TravelRoute}</p>
                `;
            });
        })
        .catch(error => console.error('查询失败:', error));
}

// Insert Customer Info
function insertCustomer() {
    let custName = document.getElementById('insertCustomerName').value;
    let custID = document.getElementById('insertCustomerID').value;

    let data = {
        custName: custName,
        custID: custID
    };

    fetch('http://localhost:8080/api/customers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => alert('客户信息插入成功'))
        .catch(error => console.error('插入失败:', error));
}
