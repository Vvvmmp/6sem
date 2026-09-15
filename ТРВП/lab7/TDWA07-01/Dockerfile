FROM --platform=linux/amd64 mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -r linux-x64 --self-contained true /p:PublishSingleFile=true -o /app/publish

FROM --platform=linux/amd64 mcr.microsoft.com/dotnet/runtime-deps:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENV DB_CONNECTION_STRING="Server=mssql;Database=Celebrities;User Id=sa;Password=Testpassword2#;TrustServerCertificate=True;"
EXPOSE 8080
ENTRYPOINT ["./TDWA07-01"]