<?xml version="1.0" encoding="utf-8"?>
<serviceModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" name="WebApplication.Azure" generation="1" functional="0" release="0" Id="7f92fad5-1800-4857-9233-d67714671272" dslVersion="1.2.0.0" xmlns="http://schemas.microsoft.com/dsltools/RDSM">
  <groups>
    <group name="WebApplication.AzureGroup" generation="1" functional="0" release="0">
      <componentports>
        <inPort name="WebApplication:Endpoint1" protocol="http">
          <inToChannel>
            <lBChannelMoniker name="/WebApplication.Azure/WebApplication.AzureGroup/LB:WebApplication:Endpoint1" />
          </inToChannel>
        </inPort>
      </componentports>
      <settings>
        <aCS name="WebApplication:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="">
          <maps>
            <mapMoniker name="/WebApplication.Azure/WebApplication.AzureGroup/MapWebApplication:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </maps>
        </aCS>
        <aCS name="WebApplicationInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/WebApplication.Azure/WebApplication.AzureGroup/MapWebApplicationInstances" />
          </maps>
        </aCS>
      </settings>
      <channels>
        <lBChannel name="LB:WebApplication:Endpoint1">
          <toPorts>
            <inPortMoniker name="/WebApplication.Azure/WebApplication.AzureGroup/WebApplication/Endpoint1" />
          </toPorts>
        </lBChannel>
      </channels>
      <maps>
        <map name="MapWebApplication:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" kind="Identity">
          <setting>
            <aCSMoniker name="/WebApplication.Azure/WebApplication.AzureGroup/WebApplication/Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </setting>
        </map>
        <map name="MapWebApplicationInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/WebApplication.Azure/WebApplication.AzureGroup/WebApplicationInstances" />
          </setting>
        </map>
      </maps>
      <components>
        <groupHascomponents>
          <role name="WebApplication" generation="1" functional="0" release="0" software="C:\dev\ms-20487-exam-prep\mod_12\Demos\1_ScalingWebApplications\WebApplication.Azure\csx\Release\roles\WebApplication" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaIISHost.exe " memIndex="-1" hostingEnvironment="frontendadmin" hostingEnvironmentVersion="2">
            <componentports>
              <inPort name="Endpoint1" protocol="http" portRanges="80" />
            </componentports>
            <settings>
              <aCS name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="" />
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;WebApplication&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;WebApplication&quot;&gt;&lt;e name=&quot;Endpoint1&quot; /&gt;&lt;/r&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/WebApplication.Azure/WebApplication.AzureGroup/WebApplicationInstances" />
            <sCSPolicyUpdateDomainMoniker name="/WebApplication.Azure/WebApplication.AzureGroup/WebApplicationUpgradeDomains" />
            <sCSPolicyFaultDomainMoniker name="/WebApplication.Azure/WebApplication.AzureGroup/WebApplicationFaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
      </components>
      <sCSPolicy>
        <sCSPolicyUpdateDomain name="WebApplicationUpgradeDomains" defaultPolicy="[5,5,5]" />
        <sCSPolicyFaultDomain name="WebApplicationFaultDomains" defaultPolicy="[2,2,2]" />
        <sCSPolicyID name="WebApplicationInstances" defaultPolicy="[1,1,1]" />
      </sCSPolicy>
    </group>
  </groups>
  <implements>
    <implementation Id="65303f07-43d0-4544-a85d-6a7f437282fb" ref="Microsoft.RedDog.Contract\ServiceContract\WebApplication.AzureContract@ServiceDefinition">
      <interfacereferences>
        <interfaceReference Id="45bb920c-d1fa-4f23-8fa3-a36907df7c40" ref="Microsoft.RedDog.Contract\Interface\WebApplication:Endpoint1@ServiceDefinition">
          <inPort>
            <inPortMoniker name="/WebApplication.Azure/WebApplication.AzureGroup/WebApplication:Endpoint1" />
          </inPort>
        </interfaceReference>
      </interfacereferences>
    </implementation>
  </implements>
</serviceModel>