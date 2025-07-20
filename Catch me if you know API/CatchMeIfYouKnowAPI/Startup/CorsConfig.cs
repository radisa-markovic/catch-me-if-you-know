public static class CorsConfig
{
    private readonly static string AllowAllPolicy = "AllowAll";

    public static void AddCorsServices(this IServiceCollection services)
    {
        services.AddCors((options) =>
        {
            options.AddPolicy(AllowAllPolicy, (policy) =>
            {
                policy.AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin();
            });
        });
    }

    public static void ApplyCorsConfig(this WebApplication app)
    {
        app.UseCors(AllowAllPolicy);
    }
}