from datetime import datetime
from functools import reduce
data = {
    'Team A': [{
        'start': 1,#'11/Jul/13 1:49 PM',
        'end': 3, #'10/Oct/13 5:16 PM',
        'issue': 'KEY-12678'
    }, {
        'start': 2, #'3/Oct/13 10:40 AM',
        'end': 4, #'11/Nov/13 1:02 PM',
        'issue': 'KEY-12678'
    }],

    'Team B': [{
        'start': 7, #'5/Sep/13 3:35 PM',
        'end': 9, #'08/Nov/13 3:35 PM',
        'issue': 'KEY-12679'
    }, {
        'start': 5, #'19/Aug/13 5:05 PM',
        'end': 8, #'10/Sep/13 5:16 PM',
        'issue': 'KEY-12679'
    }, {
        'start': 1, #'09/Jul/13 9:15 AM',
        'end': 2, #'29/Jul/13 9:15 AM',
        'issue': 'KEY-12680'
    }]
} 


#start_date = datetime.strptime(issue['start'], date_format)
#end_date = datetime.strptime(issue['end'], date_format)

#date_format = "%d/%b/%y %H:%M %p"

def func(accumulated, issue):
    try:
        last_issue = accumulated[-1]
    except IndexError:
        return [issue]
    if (issue['start'] <= last_issue['end'] and
        issue['end'] >= last_issue['start']):
        accumulated.append(issue)
    return accumulated

for team, issues in data.items():
    result = reduce(func, issues, [])
    print(result)
        

