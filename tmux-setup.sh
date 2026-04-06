#!/bin/bash

SESSION="personal-web"
DIR="/Users/sondongju/Desktop/personal-web"

# 기존 세션 종료
tmux kill-session -t $SESSION 2>/dev/null

# 세션 생성 (pane 0: 왼쪽 오케스트레이터)
tmux new-session -d -s $SESSION -c $DIR

# 오른쪽으로 분할 (pane 1: planner)
tmux split-window -h -t "${SESSION}:0.0" -c $DIR

# pane 1 아래로 분할 (pane 2: frontend-dev)
tmux split-window -v -t "${SESSION}:0.1" -c $DIR

# pane 2 아래로 분할 (pane 3: reviewer)
tmux split-window -v -t "${SESSION}:0.2" -c $DIR

# 왼쪽 패널 크게 (비율 조정)
tmux resize-pane -t "${SESSION}:0.0" -x 60%

# 각 패널에 claude 실행
tmux send-keys -t "${SESSION}:0.0" "claude" Enter
tmux send-keys -t "${SESSION}:0.1" "claude" Enter
tmux send-keys -t "${SESSION}:0.2" "claude" Enter
tmux send-keys -t "${SESSION}:0.3" "claude" Enter

# 스킬 자동 로드 (claude 뜰 때까지 대기)
sleep 5
tmux send-keys -t "${SESSION}:0.1" "/planner" Enter
tmux send-keys -t "${SESSION}:0.2" "/frontend-dev" Enter
tmux send-keys -t "${SESSION}:0.3" "/reviewer" Enter

# 왼쪽 포커스
tmux select-pane -t "${SESSION}:0.0"

tmux attach-session -t $SESSION
