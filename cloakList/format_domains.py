import csv, json

def parseCsv():
    with open('cname_cloaking_site.csv', 'r') as f:
        c = csv.DictReader(f)
        subdomains = [l['subdomain'] for l in c]
        return subdomains
    
def reformat(subdomain_list):
    with open('reformatted.txt', 'w') as f:
        for subdomain in subdomain_list:
            f.write('{}:{}\n'.format(subdomain.split('.')[0], subdomain))

def toJSON():
    # this is such awful code ahaha
    with open('reformatted.txt', 'r') as f:
        keys = []
        values = []

        for line in f:
            line = line.strip().split(':')
            keys.append(line[0])
            values.append(line[1])
        
        dictionary = {key:[] for key in set(keys)}

        for key, value in zip(keys, values):
            dictionary[key].append(value)
        
    with open('subdomains.json', 'w') as f: 
        json.dump(dictionary, f)

if __name__ == '__main__':
    subdomain_list = parseCsv()
    reformat(subdomain_list)
    toJSON()
