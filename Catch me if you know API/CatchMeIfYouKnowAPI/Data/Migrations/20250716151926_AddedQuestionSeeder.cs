using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CatchMeIfYouKnowAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedQuestionSeeder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Questions",
                columns: new[] { "Id", "Answer", "Content" },
                values: new object[,]
                {
                    { 1, "Elbrus", "Najvisi vrh Evrope?" },
                    { 2, "Mont Everest", "Najvisi vrh Azije?" },
                    { 3, "Kilimandzaro", "Najvisi vrh Afrike?" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 3);
        }
    }
}
