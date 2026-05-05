using Ocelot.DependencyInjection;
using Ocelot.LoadBalancer.Interfaces;
using Ocelot.Middleware;
using Ocelot.Responses;
using Ocelot.Values;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

builder.Services.AddOcelot()
    .AddCustomLoadBalancer<CustomWLB>((serviceProvider, route, serviceDiscoveryProvider) => {
        var services = serviceDiscoveryProvider.GetAsync().GetAwaiter().GetResult();
        return new CustomWLB(services);
    });

builder.WebHost.UseUrls("http://localhost:5000");

var app = builder.Build();
await app.UseOcelot();
app.Run();

public class CustomWLB : ILoadBalancer
{
    private readonly List<Service> _services;
    private int _requestCount = 0;
    private readonly object _lock = new();

    public string Type => nameof(CustomWLB);

    public CustomWLB(List<Service> services) => _services = services;

    public Task<Response<ServiceHostAndPort>> Lease(HttpContext httpContext)
    {
        return LeaseAsync(httpContext);
    }

    public void Release(ServiceHostAndPort hostAndPort) { }

    public async Task<Response<ServiceHostAndPort>> LeaseAsync(HttpContext httpContext)
    {
        await Task.CompletedTask;

        lock (_lock)
        {
            _requestCount++;
            int index = _requestCount % 10;
            int targetPort = index < 5 ? 5001 : (index < 8 ? 5002 : 5003);

            var service = _services.FirstOrDefault(s => s.HostAndPort.DownstreamPort == targetPort);

            if (service == null) service = _services.FirstOrDefault();

            return new OkResponse<ServiceHostAndPort>(service.HostAndPort);
        }
    }
}