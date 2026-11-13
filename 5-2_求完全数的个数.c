#include<stdio.h>

int is_perfect(int n)
{
    int i,sum=1;
    if(n<=1)return 0;
    for(i=2;i*i<=n;i++){
        if(n%i==0){
            sum+=i;
            if(i!=n/i)sum+=n/i;
        }
    }
    return sum==n;
}

int main()
{
    int n,i,cnt=0;
    scanf("%d",&n);
    for(i=2;i<=n;i++){
        if(is_perfect(i))cnt++;
    }
    printf("%d\n",cnt);
    return 0;
}
