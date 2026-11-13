int is_triangle(double a, double b, double c)
{
    if (a + b > c && a + c > b && b + c > a)
        return 1;
    else
        return 0;
}

double area(double a, double b, double c)
{
    double p = (a + b + c) / 2;
    return sqrt(p * (p - a) * (p - b) * (p - c));
}
