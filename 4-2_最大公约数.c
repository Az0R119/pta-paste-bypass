int gcd(int x, int y)
{
    int t;
    while (y != 0) {
        t = x % y;
        x = y;
        y = t;
    }
    return x;
}
