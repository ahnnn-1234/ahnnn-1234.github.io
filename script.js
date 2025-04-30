document.addEventListener('DOMContentLoaded', () => {
    // 요소 가져오기
    const seats = document.querySelectorAll('.seat');
    const timeSelection = document.getElementById('timeSelection');
    const timeBlocks = document.querySelectorAll('.time-block');
    const confirmBtn = document.getElementById('confirmBtn');
    
    let selectedSeat = null;
    let selectedTimes = []; // 배열로 변경하여 여러 시간 저장 가능
    let reservedSeat = null; // 현재 사용자가 예약한 자리
    let timerInterval = null; // 타이머 인터벌
    let remainingTime = 30; // 예약 시간 제한 (초)
    
    // 타이머 요소 생성
    const timerElement = document.createElement('div');
    timerElement.className = 'timer';
    timerElement.style.display = 'none';
    timerElement.style.marginTop = '10px';
    timerElement.style.fontWeight = 'bold';
    timerElement.style.color = '#e74c3c';
    timeSelection.insertBefore(timerElement, timeSelection.firstChild);
    
    // 타이머 시작 함수
    function startTimer() {
        // 기존 타이머가 있으면 초기화
        clearInterval(timerInterval);
        
        // 타이머 초기화
        remainingTime = 30;
        updateTimerDisplay();
        timerElement.style.display = 'block';
        
        // 타이머 시작
        timerInterval = setInterval(() => {
            remainingTime--;
            updateTimerDisplay();
            
            // 시간이 다 되면 원래 페이지로 돌아가기
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                resetToInitialState();
                alert('예약 시간이 초과되었습니다. 처음부터 다시 시도해주세요.');
            }
        }, 1000);
    }
    
    // 타이머 중지 함수
    function stopTimer() {
        clearInterval(timerInterval);
        timerElement.style.display = 'none';
    }
    
    // 초기 상태로 리셋하는 함수
    function resetToInitialState() {
        // 선택된 자리가 있으면 선택 해제
        if (selectedSeat) {
            selectedSeat.classList.remove('selecting');
            selectedSeat = null;
        }
        
        // 시간 선택 패널 숨기기
        timeSelection.classList.remove('show');
        
        // 시간 선택 초기화
        resetTimeSelection();
        
        // 타이머 중지
        stopTimer();
    }
    
    // 타이머 디스플레이 업데이트
    function updateTimerDisplay() {
        timerElement.textContent = `남은 시간: ${remainingTime}초`;
        
        // 10초 이하면 빨간색으로 깜빡이게
        if (remainingTime <= 10) {
            timerElement.style.animation = 'blink 0.5s infinite';
        } else {
            timerElement.style.animation = 'none';
        }
    }
    
    // 자리 클릭 이벤트 처리
    seats.forEach(seat => {
        seat.addEventListener('click', () => {
            // 이미 예약된 자리는 선택할 수 없음
            if (seat.classList.contains('reserved') && seat !== reservedSeat) {
                alert('다른 사용자가 이미 예약한 자리입니다.');
                return;
            }
            
            // 이미 내가 예약한 자리를 클릭한 경우 예약 취소
            if (seat === reservedSeat) {
                if (confirm('예약을 취소하시겠습니까?')) {
                    seat.classList.remove('reserved');
                    reservedSeat = null;
                    alert('예약이 취소되었습니다.');
                }
                return;
            }
            
            // 내가 다른 자리를 이미 예약한 상태에서 새 자리를 선택한 경우
            if (reservedSeat !== null && seat !== reservedSeat) {
                alert('다른 자리를 예약하려면 먼저 기존 예약을 취소해야 합니다.');
                return;
            }
            
            // 다른 자리가 선택되어 있었다면 초기화
            if (selectedSeat && selectedSeat !== seat) {
                selectedSeat.classList.remove('selecting');
            }
            
            // 현재 자리 선택 상태 설정
            seat.classList.toggle('selecting');
            
            // 자리가 선택되었는지 확인
            if (seat.classList.contains('selecting')) {
                selectedSeat = seat;
                timeSelection.classList.add('show');
                // 타이머 시작
                startTimer();
            } else {
                resetToInitialState();
            }
        });
    });
    
    // 시간 블록 클릭 이벤트 처리 - 다중 선택 가능하도록 수정
    timeBlocks.forEach(timeBlock => {
        timeBlock.addEventListener('click', () => {
            // 시간 블록 토글
            timeBlock.classList.toggle('selected');
            
            // 선택된 시간 배열 업데이트
            if (timeBlock.classList.contains('selected')) {
                // 시간을 선택 목록에 추가
                if (!selectedTimes.includes(timeBlock)) {
                    selectedTimes.push(timeBlock);
                }
            } else {
                // 시간을 선택 목록에서 제거
                selectedTimes = selectedTimes.filter(time => time !== timeBlock);
            }
            
            // 하나 이상의 시간이 선택되면 확인 버튼 표시
            if (selectedTimes.length > 0) {
                confirmBtn.classList.add('show');
            } else {
                confirmBtn.classList.remove('show');
            }
        });
    });
    
    // 확인 버튼 클릭 이벤트 처리
    confirmBtn.addEventListener('click', () => {
        if (selectedSeat && selectedTimes.length > 0) {
            // 예약 확정
            selectedSeat.classList.remove('selecting');
            selectedSeat.classList.add('reserved');
            
            // 현재 사용자의 예약 자리 기록
            reservedSeat = selectedSeat;
            
            // 타이머 중지
            stopTimer();
            
            // 시간 선택 패널 초기화
            timeSelection.classList.remove('show');
            
            // 선택한 시간대 텍스트 추출
            const timeTexts = selectedTimes.map(time => time.textContent).join(', ');
            
            // 예약 확인 메시지 표시
            alert(`자리 ${selectedSeat.textContent}번이 다음 시간대에 예약되었습니다: ${timeTexts}`);
            
            // 선택 상태 초기화
            selectedSeat = null;
            resetTimeSelection();
        }
    });
    
    // 시간 선택 패널 초기화 함수
    function resetTimeSelection() {
        timeBlocks.forEach(timeBlock => {
            timeBlock.classList.remove('selected');
        });
        confirmBtn.classList.remove('show');
        selectedTimes = [];
    }
    
    // CSS 애니메이션 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}); 