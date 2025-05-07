// Check login status first
if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    // If not logged in, redirect to login page
    window.location.href = 'login.html';
} else {
    // Only run the rest of the script if logged in
    document.addEventListener('DOMContentLoaded', () => {
        // 층별 방 정보 데이터
        const floorData = {
            1: {
                name: '1층',
                rooms: [
                    { name: '정보 검색실', seats: 6 },
                    { name: '로비', seats: 6 }
                ]
            },
            2: {
                name: '2층',
                rooms: [
                    { name: '정보 검색실', seats: 6 },
                    { name: '다목적실', seats: 6 }
                ]
            },
            3: {
                name: '3층',
                rooms: [
                    { name: '정보 검색실', seats: 6 },
                    { name: '다목적실', seats: 6 }
                ]
            },
            4: {
                name: '4층',
                rooms: [
                    { name: '정보 검색실', seats: 6 },
                    { name: '다목적실', seats: 6 }
                ]
            },
            5: {
                name: '5층',
                rooms: [
                    { name: '정보 검색실', seats: 6 }
                ]
            }
        };
        
        // 층별 HTML 동적 생성
        function generateFloorHTML() {
            const floorContainer = document.getElementById('floorContainer');
            floorContainer.innerHTML = ''; // 기존 내용 초기화
            
            // 각 층별 요소 생성
            for (const floorNum in floorData) {
                const floor = floorData[floorNum];
                
                // 층 요소 생성
                const floorElement = document.createElement('div');
                floorElement.className = 'floor';
                floorElement.id = `floor${floorNum}`;
                
                // 층 이름 추가
                const floorTitle = document.createElement('h3');
                floorTitle.textContent = floor.name;
                floorElement.appendChild(floorTitle);
                
                // 방 선택 버튼 컨테이너 생성
                const roomSelector = document.createElement('div');
                roomSelector.className = 'room-selector';
                
                // 방 컨테이너 생성
                const roomContainer = document.createElement('div');
                roomContainer.className = 'room-container';
                
                // 각 방별 요소 생성
                floor.rooms.forEach(room => {
                    // 방 버튼 생성
                    const roomBtn = document.createElement('button');
                    roomBtn.className = 'room-btn';
                    roomBtn.setAttribute('data-floor', floorNum);
                    roomBtn.setAttribute('data-room', room.name);
                    roomBtn.textContent = room.name;
                    roomSelector.appendChild(roomBtn);
                    
                    // 방 요소 생성
                    const roomElement = document.createElement('div');
                    roomElement.className = 'room';
                    roomElement.id = `floor${floorNum}-${room.name}`;
                    
                    // 방 이름 추가
                    const roomTitle = document.createElement('h4');
                    roomTitle.textContent = room.name;
                    roomElement.appendChild(roomTitle);
                    
                    // 좌석 컨테이너 생성
                    const seatsContainer = document.createElement('div');
                    seatsContainer.className = 'seats-container';
                    
                    // 좌석 생성
                    for (let i = 1; i <= room.seats; i++) {
                        const seat = document.createElement('div');
                        seat.className = 'seat';
                        seat.setAttribute('data-floor', floorNum);
                        seat.setAttribute('data-room', room.name);
                        seat.setAttribute('data-seat', i);
                        seat.textContent = i;
                        seatsContainer.appendChild(seat);
                    }
                    
                    roomElement.appendChild(seatsContainer);
                    roomContainer.appendChild(roomElement);
                });
                
                // 층 요소에 방 선택 버튼과 방 컨테이너 추가
                floorElement.appendChild(roomSelector);
                floorElement.appendChild(roomContainer);
                
                // 층 컨테이너에 층 요소 추가
                floorContainer.appendChild(floorElement);
            }
        }
        
        // 페이지 로드 시 층별 HTML 생성
        generateFloorHTML();
        
        // 요소 가져오기 (동적 생성 후)
        const floorBtns = document.querySelectorAll('.floor-btn');
        const floors = document.querySelectorAll('.floor');
        const roomBtns = document.querySelectorAll('.room-btn');
        const rooms = document.querySelectorAll('.room');
        const seats = document.querySelectorAll('.seat');
        const timeSelection = document.getElementById('timeSelection');
        const timeBlocks = document.querySelectorAll('.time-block');
        const confirmBtn = document.getElementById('confirmBtn');
        
        let selectedSeat = null;
        let selectedTimes = []; // 배열로 변경하여 여러 시간 저장 가능
        let reservedSeat = null; // 현재 사용자가 예약한 자리
        let timerInterval = null; // 타이머 인터벌
        let remainingTime = 30; // 예약 시간 제한 (초)
        
        // 층 선택 초기화 (기본: 1층)
        showFloor(1);
        
        // 층 선택 버튼 클릭 이벤트
        floorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const floorNum = btn.getAttribute('data-floor');
                
                // 버튼 활성화 상태 변경
                floorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 선택된 층 표시
                showFloor(floorNum);
                
                // 방 선택 초기화
                hideAllRooms();
                
                // 층에 해당하는 첫 번째 방 버튼 활성화
                const firstRoomBtn = document.querySelector(`.room-btn[data-floor="${floorNum}"]`);
                if (firstRoomBtn) {
                    simulateClick(firstRoomBtn);
                }
            });
        });
        
        // 방 선택 버튼 클릭 이벤트
        roomBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const floorNum = btn.getAttribute('data-floor');
                const roomName = btn.getAttribute('data-room');
                
                // 같은 층의 방 버튼 활성화 상태 변경
                document.querySelectorAll(`.room-btn[data-floor="${floorNum}"]`).forEach(b => {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
                
                // 선택된 방 표시
                showRoom(floorNum, roomName);
            });
        });
        
        // 층 표시 함수
        function showFloor(floorNum) {
            floors.forEach(floor => {
                floor.classList.remove('active');
            });
            
            document.getElementById(`floor${floorNum}`).classList.add('active');
        }
        
        // 방 표시 함수
        function showRoom(floorNum, roomName) {
            // 현재 층의 모든 방 숨기기
            document.querySelectorAll(`.room[id^="floor${floorNum}"]`).forEach(room => {
                room.classList.remove('active');
            });
            
            // 선택된 방 표시
            const roomElement = document.getElementById(`floor${floorNum}-${roomName}`);
            if (roomElement) {
                roomElement.classList.add('active');
            }
        }
        
        // 모든 방 숨기기
        function hideAllRooms() {
            rooms.forEach(room => {
                room.classList.remove('active');
            });
            
            // 방 버튼 활성화 상태 제거
            roomBtns.forEach(btn => {
                btn.classList.remove('active');
            });
        }
        
        // 버튼 클릭 시뮬레이션 함수
        function simulateClick(element) {
            if (element) {
                element.classList.add('active');
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                element.dispatchEvent(event);
            }
        }
        
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
        
        // 자리 클릭 이벤트 처리 - 동적 요소에 이벤트 위임
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('seat')) {
                const seat = e.target;
                
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
            }
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
        
        // 확인 버튼 클릭 이벤트
        confirmBtn.addEventListener('click', () => {
            if (!selectedSeat || selectedTimes.length === 0) {
                alert('좌석과 시간을 모두 선택해주세요.');
                return;
            }
        
            const floor = selectedSeat.getAttribute('data-floor');
            const room = selectedSeat.getAttribute('data-room');
            const seatNum = selectedSeat.getAttribute('data-seat');
            const seatDetails = `${floorData[floor].name} ${room} ${seatNum}번 좌석`;
            const seatId = `floor${floor}-${room}-seat${seatNum}`; // 내부 ID
        
            const userEmail = localStorage.getItem('userEmail');
        
            if (!userEmail) {
                alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
                // 필요시 로그인 페이지로 리디렉션
                // window.location.href = 'login.html';
                return;
            }
        
            let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
            let newReservationsMade = []; // 이번에 새로 추가된 예약들
            let alertMessages = []; // 사용자에게 보여줄 알림 메시지들

            // 예약 시도 전에 한 번에 모든 selectedTimes에 대해 유효성 검사를 수행
            let canProceedAll = true;
            for (const timeId of selectedTimes) {
                const timeBlock = document.getElementById(timeId);
                const timeText = timeBlock ? timeBlock.textContent : timeId;

                // 1. 현재 선택된 좌석과 시간에 대해 다른 사용자가 먼저 예약했는지 확인
                if (reservations.some(res => res.seatId === seatId && res.time === timeText && res.email !== userEmail)) {
                    alertMessages.push(`죄송합니다. ${seatDetails}의 ${timeText} 시간은 방금 다른 사용자가 예약했습니다.`);
                    canProceedAll = false;
                    break; 
                }
        
                // 2. 현재 사용자가 선택한 시간대에 이미 다른 좌석을 예약했는지 확인
                if (reservations.some(res => res.email === userEmail && res.time === timeText && res.seatId !== seatId)) {
                    alertMessages.push(`이미 ${timeText}에 다른 좌석을 예약하셨습니다. 기존 예약을 취소하고 다시 시도해주세요.`);
                    canProceedAll = false;
                    break;
                }
            }

            if (!canProceedAll) {
                alert(alertMessages.join('\n'));
                resetToInitialState(); // 필요한 경우 상태 초기화
                loadReservations();    // 최신 예약 상태 로드
                return;
            }
        
            // 3. 모든 유효성 검사를 통과했으면 예약 진행 및 저장
            let successfulReservationDetails = [];
            selectedTimes.forEach(timeId => {
                const timeBlock = document.getElementById(timeId);
                const timeText = timeBlock ? timeBlock.textContent : timeId;
        
                // 기존 예약과 중복되지 않는 경우에만 추가 (같은 사용자, 같은 좌석, 같은 시간)
                // 이 단계에서는 다른 사용자/다른 좌석에 대한 중복은 위에서 이미 걸렀으므로, 현재 사용자의 동일 좌석/시간 중복만 체크
                if (!reservations.some(r => r.email === userEmail && r.seatId === seatId && r.time === timeText)) {
                    const newReservation = {
                        email: userEmail,
                        seat: seatDetails, // 사용자 표시용
                        seatId: seatId,    // 내부 ID
                        time: timeText,    // 시간 블록의 텍스트 내용으로 저장
                        floor: floor,
                        room: room,
                        seatNum: seatNum,
                        timestamp: new Date().toISOString() // 예약 시간 기록
                    };
                    reservations.push(newReservation);
                    newReservationsMade.push(newReservation); // 새로 추가된 예약 기록
                    successfulReservationDetails.push(timeText);
                }
            });
        
            if (newReservationsMade.length > 0) {
                localStorage.setItem('reservations', JSON.stringify(reservations));
                console.log('Updated reservations:', reservations);
        
                alert(`예약 확정:\n좌석: ${seatDetails}\n시간: ${successfulReservationDetails.join(', ')}\n예약자: ${userEmail}`);
        
                // UI 업데이트
                newReservationsMade.forEach(res => {
                    const targetSeatForUpt = document.querySelector(`.seat[data-floor="${res.floor}"][data-room="${res.room}"][data-seat="${res.seatNum}"]`);
                    if (targetSeatForUpt) {
                        targetSeatForUpt.classList.add('reserved-by-user');
                    }
                });
                 updateAvailableTimesForSeat(seatId); // 현재 좌석의 시간 블록 상태 업데이트

            } else if (selectedTimes.length > 0) { // 선택한 시간이 있었지만, 모두 이미 예약된 경우
                alert('선택하신 시간은 이미 예약하셨거나 예약할 수 없습니다.');
            } else {
                // 이 경우는 selectedTimes.length === 0 일때인데, 맨 위에서 이미 처리됨.
            }
        
            stopTimer();
            if (selectedSeat) { 
                 selectedSeat.classList.remove('selected'); // 좌석의 'selected' 상태는 해제
            }
            resetTimeSelection(); 
            timeSelection.style.display = 'none';
            confirmBtn.classList.remove('show');
            loadReservations(); // 전체 좌석 상태 및 현재 좌석 시간 업데이트
        });
        
        // 시간 선택 초기화
        function resetTimeSelection() {
            // 시간 블록 선택 해제
            timeBlocks.forEach(timeBlock => {
                timeBlock.classList.remove('selected');
            });
            
            // 선택된 시간 배열 초기화
            selectedTimes = [];
            
            // 확인 버튼 숨기기
            confirmBtn.classList.remove('show');
        }
    });
}
