S = [1, 5,10, 20, 50, 100]

cc_table = {}

def C(n, m):
    print(n,m)

    if n == 0:
        return 0

    if n < 0:
        return float('inf')

    if n>=1 and m < 0:
        return float('inf')
    
    return min(
        C(n, m - 1),
        C(n - S[m], m) + 1
    )

cc_table = {}

def C_memo(n, m):

    if ((n,m) in cc_table):
        return cc_table[(n,m)]

    if n == 0:
        return 0

    if n < 0:
        return float('inf')

    if n>=1 and m < 0:
        return float('inf')
    
    cc_table[(n,m)] = min(
        C_memo(n, m - 1),
        C_memo(n - S[m], m) + 1
    )
    return cc_table[(n,m)]



S = [1, 5, 10, 20]

def C_greedy(n):
    m = len(S) - 1
    counter = 0
    while (m>=0):
        x, n = divmod(n, S[m])
        m -= 1
        counter += x
    return counter


# print(C(100, len(S) - 1))
val = 40
#print(C(val, len(S) - 1))
print(C_greedy(999999))
#print(C_memo(val, len(S) - 1))