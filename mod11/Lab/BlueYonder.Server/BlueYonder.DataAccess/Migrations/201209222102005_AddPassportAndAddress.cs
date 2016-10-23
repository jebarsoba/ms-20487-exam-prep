namespace BlueYonder.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPassportAndAddress : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.FrequentFlyer", "HomeAddress", c => c.String());
            AddColumn("dbo.FrequentFlyer", "Passport", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.FrequentFlyer", "Passport");
            DropColumn("dbo.FrequentFlyer", "HomeAddress");
        }
    }
}
