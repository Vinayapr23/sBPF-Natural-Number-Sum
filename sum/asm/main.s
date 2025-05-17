.globl entrypoint
entrypoint:
    // Load `n` from instruction data
    ldxb r8, [r1+8+8+80+10240+8+8] ; r8 = n

    // Reject n > 6074000999 (max safe n for sum)
    mov64 r2, 6074000999
    jgt r8, r2, overflow

    // Init sum (r6) = 0, i (r7) = 1
    mov64 r6, 0
    mov64 r7, 1

sum_loop:
    jgt r7, r8, finalize // if i > n, finish

    mov64 r9, r6           // preserve old sum
    add64 r6, r7           // sum += i
    jlt r6, r9, overflow   // detect overflow

    add64 r7, 1
    ja sum_loop

overflow:
    lddw r0, 1
    lddw r1, e1
    lddw r2, 46
    call sol_log_
    exit

finalize:
    // Move sum to r1 and zero r2-r5 for clean sol_log_64_ output
    mov64 r1, r6
    mov64 r2, 0
    mov64 r3, 0
    mov64 r4, 0
    mov64 r5, 0
    call sol_log_64_
    exit

.extern sol_log_ sol_log_64_

.rodata
e1: .ascii "Sorry, sum(n) overflows u64 for n > 6074000999"
