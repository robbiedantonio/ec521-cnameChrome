import csv

def parseCsv():
    with open('cname_cloaking_site.csv', 'r') as f:
        c = csv.DictReader(f)
        subdomains = [l['subdomain'] for l in c]
        return subdomains
    
def reformat(subdomain_list):
    with open('reformatted.txt', 'w') as f:
        for subdomain in subdomain_list:
            f.write('{}:{}'.format(subdomain.split('.')[0], subdomain))


if __name__ == '__main__':
    subdomain_list = parseCsv()
    reformat(subdomain_list)
