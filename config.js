// ==========================================
// ১. পাসওয়ার্ড ও রোল কনফিগারেশন (এখানে চেঞ্জ করবেন)
// ==========================================
const ACCESS_KEYS = {
    "admin123": "ADMIN",      // Admin: ফাইল আপলোড + পাসওয়ার্ড লিস্ট দেখার অ্যাক্সেস
    "user123":  "ANALYST",    // Analyst: শুধু ফাইল আপলোড ও প্রসেস করার অ্যাক্সেস
    "team2026": "ANALYST"     // অতিরিক্ত ইউজার পাসওয়ার্ড
};

// ==========================================
// ২. সিস্টেম লজিক ও প্রসেসিং
// ==========================================
let currentUserRole = null;

function checkAccess() {
    const input = document.getElementById('passInput').value;
    const errorDiv = document.getElementById('loginError');
    
    if (ACCESS_KEYS[input]) {
        currentUserRole = ACCESS_KEYS[input];
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appScreen').style.display = 'block';
        
        const badge = document.getElementById('userRoleBadge');
        badge.innerText = "Role: " + currentUserRole;
        
        if (currentUserRole === 'ADMIN') {
            badge.className = "role-badge admin-badge";
            document.getElementById('adminPanel').style.display = 'block';
            renderAdminPanel();
        } else {
            badge.className = "role-badge user-badge";
            document.getElementById('adminPanel').style.display = 'none';
        }
    } else {
        errorDiv.innerText = "Invalid Password! Please try again.";
    }
}

function renderAdminPanel() {
    const list = document.getElementById('passwordList');
    list.innerHTML = '';
    for (let pass in ACCESS_KEYS) {
        list.innerHTML += `<li><strong>${pass}</strong> : ${ACCESS_KEYS[pass]}</li>`;
    }
}

function logout() {
    document.getElementById('passInput').value = '';
    document.getElementById('loginError').innerText = '';
    document.getElementById('appScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'block';
}

function processExcel() {
    const fileInput = document.getElementById('excelFile');
    if (!fileInput.files.length) {
        alert('Please select an Excel file first!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        let html = '';
        jsonData.forEach(row => {
            let status = (row.Amount > 0) ? 'Active' : 'New NIS';
            html += `<tr>
                <td>${row['Mobile No'] || '-'}</td>
                <td>${row['Emp Code'] || '-'}</td>
                <td>${row.Amount || 0}</td>
                <td>${status}</td>
            </tr>`;
        });
        document.querySelector('#resultTable tbody').innerHTML = html;
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
}