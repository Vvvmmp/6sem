#!/bin/zsh

methods=("GET" "POST" "PUT" "DELETE")
declare -A results
results=([Server1]=0 [Server2]=0 [Server3]=0)

for method in "${methods[@]}"; do
    echo "\033[36mRunning 20 requests for $method...\033[0m"
    for i in {1..20}; do
        resp=$(curl -s -X $method http://localhost:5000/lb)
            if [[ "$resp" == *"Server1"* ]]; then ((results[Server1]++))
        elif [[ "$resp" == *"Server2"* ]]; then ((results[Server2]++))
        elif [[ "$resp" == *"Server3"* ]]; then ((results[Server3]++))
        fi
    done
done

echo "\n\033[33m--- RESULTS ---\033[0m"
for key in ${(k)results}; do
    echo "Server $key: ${results[$key]} requests"
done