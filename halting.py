class ProgramDidNotTerminate(Exception):
    pass
class HaltingProblem(Exception):
    pass


def canTerminate(program, *args, **kwargs):
    new_args = list(args)
    if (program == canTerminate):
        new_args.append(program)
    
    return mystery(program, *new_args, **kwargs)
def mystery(program, *args, **kwargs):
    try:
        program(*args, **kwargs)
        return True
    except ProgramDidNotTerminate:
        return False
    except RuntimeError as e:
        if (e.args[0] == 'maximum recursion depth exceeded while calling a Python object'):
            raise HaltingProblem()
            
def handleHaltingCanTerminate(program, *args, **kwargs):
    new_args = list(args)
    if (program == handleHaltingCanTerminate):
        new_args.append(program)
    try:
        return canTerminate(program, *new_args, **kwargs)
    except HaltingProblem:
        return False

def loop(cond, func, *args, **kwargs):

    globals_bef = globals()
    locals_bef = locals()

    while cond:
        if (globals_bef == globals() and locals_bef == locals()):
            raise ProgramDidNotTerminate()
        func(*args, **kwargs)

        

def prog1():
    """Progam Terminate"""
    return

def prog2():
    """Progam Did not Terminate"""
    loop(True, prog1)


def prog3(a):
    if (a == 1):
        return
    else:
        prog2()

assert handleHaltingCanTerminate(prog1) == True
assert handleHaltingCanTerminate(prog3, 1) == True
assert handleHaltingCanTerminate(prog3, 2) == False

# I have to handle the halting problem,
# Bcoz it don't know when to halt the recursive call
assert handleHaltingCanTerminate(canTerminate, canTerminate) == False

# However, Halting problem is impossible to solve 
# if it is evaluating itself. 
# Because it will contradict itself after being handled.
# i.e. before handled it says program didn't terminate
# however after handled it says program did terminate.
# hence, it contradict itself.

# ASSERT FAIL:
assert handleHaltingCanTerminate(handleHaltingCanTerminate, handleHaltingCanTerminate) == False

