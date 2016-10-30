<?xml version="1.0" encoding="utf-8"?>
<serviceModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" name="BlueYonder.Companion.Host.Azure" generation="1" functional="0" release="0" Id="0eb6bde7-9a89-4a09-861c-5c8117a55dd8" dslVersion="1.2.0.0" xmlns="http://schemas.microsoft.com/dsltools/RDSM">
  <groups>
    <group name="BlueYonder.Companion.Host.AzureGroup" generation="1" functional="0" release="0">
      <componentports>
        <inPort name="BlueYonder.Companion.Host:Endpoint1" protocol="http">
          <inToChannel>
            <lBChannelMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/LB:BlueYonder.Companion.Host:Endpoint1" />
          </inToChannel>
        </inPort>
        <inPort name="BlueYonder.Companion.Host:Endpoint2" protocol="https">
          <inToChannel>
            <lBChannelMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/LB:BlueYonder.Companion.Host:Endpoint2" />
          </inToChannel>
        </inPort>
      </componentports>
      <settings>
        <aCS name="BlueYonder.Companion.Host:ACS.IssuerName" defaultValue="">
          <maps>
            <mapMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/MapBlueYonder.Companion.Host:ACS.IssuerName" />
          </maps>
        </aCS>
        <aCS name="BlueYonder.Companion.Host:ACS.Realm" defaultValue="">
          <maps>
            <mapMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/MapBlueYonder.Companion.Host:ACS.Realm" />
          </maps>
        </aCS>
        <aCS name="BlueYonder.Companion.Host:ACS.SigningKey" defaultValue="">
          <maps>
            <mapMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/MapBlueYonder.Companion.Host:ACS.SigningKey" />
          </maps>
        </aCS>
        <aCS name="BlueYonder.Companion.Host:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="">
          <maps>
            <mapMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/MapBlueYonder.Companion.Host:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </maps>
        </aCS>
        <aCS name="BlueYonder.Companion.HostInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/MapBlueYonder.Companion.HostInstances" />
          </maps>
        </aCS>
        <aCS name="Certificate|BlueYonder.Companion.Host:BlueYonderCompanionSSL" defaultValue="">
          <maps>
            <mapMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/MapCertificate|BlueYonder.Companion.Host:BlueYonderCompanionSSL" />
          </maps>
        </aCS>
      </settings>
      <channels>
        <lBChannel name="LB:BlueYonder.Companion.Host:Endpoint1">
          <toPorts>
            <inPortMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/BlueYonder.Companion.Host/Endpoint1" />
          </toPorts>
        </lBChannel>
        <lBChannel name="LB:BlueYonder.Companion.Host:Endpoint2">
          <toPorts>
            <inPortMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/BlueYonder.Companion.Host/Endpoint2" />
          </toPorts>
        </lBChannel>
      </channels>
      <maps>
        <map name="MapBlueYonder.Companion.Host:ACS.IssuerName" kind="Identity">
          <setting>
            <aCSMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/BlueYonder.Companion.Host/ACS.IssuerName" />
          </setting>
        </map>
        <map name="MapBlueYonder.Companion.Host:ACS.Realm" kind="Identity">
          <setting>
            <aCSMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/BlueYonder.Companion.Host/ACS.Realm" />
          </setting>
        </map>
        <map name="MapBlueYonder.Companion.Host:ACS.SigningKey" kind="Identity">
          <setting>
            <aCSMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/BlueYonder.Companion.Host/ACS.SigningKey" />
          </setting>
        </map>
        <map name="MapBlueYonder.Companion.Host:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" kind="Identity">
          <setting>
            <aCSMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/BlueYonder.Companion.Host/Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </setting>
        </map>
        <map name="MapBlueYonder.Companion.HostInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/BlueYonder.Companion.HostInstances" />
          </setting>
        </map>
        <map name="MapCertificate|BlueYonder.Companion.Host:BlueYonderCompanionSSL" kind="Identity">
          <certificate>
            <certificateMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/BlueYonder.Companion.Host/BlueYonderCompanionSSL" />
          </certificate>
        </map>
      </maps>
      <components>
        <groupHascomponents>
          <role name="BlueYonder.Companion.Host" generation="1" functional="0" release="0" software="C:\dev\ms-20487-exam-prep\mod11\Lab\BlueYonder.Server\BlueYonder.Companion.Host.Azure\csx\Release\roles\BlueYonder.Companion.Host" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaIISHost.exe " memIndex="-1" hostingEnvironment="frontendadmin" hostingEnvironmentVersion="2">
            <componentports>
              <inPort name="Endpoint1" protocol="http" portRanges="80" />
              <inPort name="Endpoint2" protocol="https" portRanges="443">
                <certificate>
                  <certificateMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/BlueYonder.Companion.Host/BlueYonderCompanionSSL" />
                </certificate>
              </inPort>
            </componentports>
            <settings>
              <aCS name="ACS.IssuerName" defaultValue="" />
              <aCS name="ACS.Realm" defaultValue="" />
              <aCS name="ACS.SigningKey" defaultValue="" />
              <aCS name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="" />
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;BlueYonder.Companion.Host&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;BlueYonder.Companion.Host&quot;&gt;&lt;e name=&quot;Endpoint1&quot; /&gt;&lt;e name=&quot;Endpoint2&quot; /&gt;&lt;/r&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
            <storedcertificates>
              <storedCertificate name="Stored0BlueYonderCompanionSSL" certificateStore="My" certificateLocation="System">
                <certificate>
                  <certificateMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/BlueYonder.Companion.Host/BlueYonderCompanionSSL" />
                </certificate>
              </storedCertificate>
            </storedcertificates>
            <certificates>
              <certificate name="BlueYonderCompanionSSL" />
            </certificates>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/BlueYonder.Companion.HostInstances" />
            <sCSPolicyUpdateDomainMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/BlueYonder.Companion.HostUpgradeDomains" />
            <sCSPolicyFaultDomainMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/BlueYonder.Companion.HostFaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
      </components>
      <sCSPolicy>
        <sCSPolicyUpdateDomain name="BlueYonder.Companion.HostUpgradeDomains" defaultPolicy="[5,5,5]" />
        <sCSPolicyFaultDomain name="BlueYonder.Companion.HostFaultDomains" defaultPolicy="[2,2,2]" />
        <sCSPolicyID name="BlueYonder.Companion.HostInstances" defaultPolicy="[1,1,1]" />
      </sCSPolicy>
    </group>
  </groups>
  <implements>
    <implementation Id="4502a544-bb19-4a9b-b58d-03062d9128ab" ref="Microsoft.RedDog.Contract\ServiceContract\BlueYonder.Companion.Host.AzureContract@ServiceDefinition">
      <interfacereferences>
        <interfaceReference Id="517d4497-7334-46a6-9f2d-a35ac98f96d4" ref="Microsoft.RedDog.Contract\Interface\BlueYonder.Companion.Host:Endpoint1@ServiceDefinition">
          <inPort>
            <inPortMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/BlueYonder.Companion.Host:Endpoint1" />
          </inPort>
        </interfaceReference>
        <interfaceReference Id="c389aed4-c415-47c3-bd02-10dd34c8b50b" ref="Microsoft.RedDog.Contract\Interface\BlueYonder.Companion.Host:Endpoint2@ServiceDefinition">
          <inPort>
            <inPortMoniker name="/BlueYonder.Companion.Host.Azure/BlueYonder.Companion.Host.AzureGroup/BlueYonder.Companion.Host:Endpoint2" />
          </inPort>
        </interfaceReference>
      </interfacereferences>
    </implementation>
  </implements>
</serviceModel>