<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="SASDemo._Default" %>

<asp:Content runat="server" ID="FeaturedContent" ContentPlaceHolderID="FeaturedContent">
    <section class="featured">
        <div class="content-wrapper">
            <hgroup class="title">
                <h1><%: Title %>.</h1>
                <h2>Upload Pictures</h2>
            </hgroup>
            <asp:Label ID="lblForFilePicture" runat="server" Text="Choose File" />
			<asp:FileUpload ID="filePicture" runat="server" />
			<asp:Button ID="btnUpload" runat="server" Text="Upload" OnClick="btnUpload_Click" />
        </div>
    </section>
</asp:Content>
<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <asp:Repeater ID="rptPhotos" runat="server">
		<HeaderTemplate>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Will not work</th>
						<th>Will work</th>
					</tr>
				</thead>
				<tbody>
		</HeaderTemplate>
		<ItemTemplate>
					<tr>
						<td><%#Eval("Name") %></td>
						<td><a href="<%#Eval("SimpleLink") %>" target="_blank">Will not work</a></td>
						<td><a href="<%#Eval("SASLink") %>" target="_blank">Will work until <%#Eval("ValidTo") %></a></td>
					</tr>
		</ItemTemplate>
		<FooterTemplate>
				</tbody>
			</table>
		</FooterTemplate>
    </asp:Repeater>
    <asp:Button ID="btnExtendPolicy" runat="server" Text="Extend Policy" OnClick="btnExtendPolicy_Click" />        
</asp:Content>
