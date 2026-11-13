#include<stdio.h>

int persist(long long n)
{
    int cnt=0;
    while(n>=10){
        long long p=1;
        while(n>0){
            p*=n%10;
            n/=10;
        }
        n=p;
        cnt++;
    }
    return cnt;
}

int main()
{
    long long a,b,i;
    int best=-1,cur;
    scanf("%lld%lld",&a,&b);
    for(i=a;i<=b;i++){
        cur=persist(i);
        if(cur>best)best=cur;
    }
    printf("%d\n",best);
    int first=1;
    for(i=a;i<=b;i++){
        if(persist(i)==best){
            if(!first)printf(" ");
            printf("%lld",i);
            first=0;
        }
    }
    printf("\n");
    return 0;
}
