using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CatchMeIfYouKnowAPI.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedSixStartingQuestions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Questions",
                columns: new[] { "Id", "Answer", "Content" },
                values: new object[,]
                {
                    { 4, "Akonkagva", "Najvisi vrh Juzne Amerike?" },
                    { 5, "Denali/Makinli", "Najvisi vrh Severne Amerike?" },
                    { 6, "Koscusko", "Najvisi vrh Okeanije?" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Questions",
                keyColumn: "Id",
                keyValue: 6);
        }
    }
}
