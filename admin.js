document.addEventListener('DOMContentLoaded', () => {
    const reservationsTableBody = document.getElementById('reservationsTable')?.getElementsByTagName('tbody')[0];
    if (!reservationsTableBody) {
        console.error('예약 테이블을 찾을 수 없습니다.');
        return;
    }

    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];

    if (reservations.length === 0) {
        const row = reservationsTableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 4; // 테이블 컬럼 수에 맞게 조절
        cell.textContent = '현재 예약된 내역이 없습니다.';
        cell.style.textAlign = 'center';
        return;
    }

    // 최신 예약이 위로 오도록 정렬 (timestamp 기준 내림차순)
    reservations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    reservations.forEach(res => {
        const row = reservationsTableBody.insertRow();
        
        const emailCell = row.insertCell();
        emailCell.textContent = res.email || 'N/A';

        const seatCell = row.insertCell();
        seatCell.textContent = res.seat || 'N/A';

        const timeCell = row.insertCell();
        timeCell.textContent = res.time || 'N/A';

        const timestampCell = row.insertCell();
        timestampCell.textContent = res.timestamp ? new Date(res.timestamp).toLocaleString('ko-KR') : 'N/A';
    });
}); 