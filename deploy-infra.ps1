param(
    [Parameter(Mandatory = $true)][string]$InstanceIdentifier,
    [int]$DynamoDBCapacityUnits = 5
)

if ($InstanceIdentifier -notmatch '^[a-zA-Z0-9]+$') {
    Write-Host "Error: InstanceIdentifier can only contain alphanumeric characters."
    exit 1
}
if ($DynamoDBCapacityUnits -lt 1) {
    Write-Host "Error: DynamoDBCapacityUnits must be a positive integer."
    exit 1
}

$Parameters = "[""DynamoDBCapacityUnits=$DynamoDBCapacityUnits"",""InstanceIdentifier=$InstanceIdentifier""]"

aws cloudformation deploy --stack-name "Typoterminator-Stack-$InstanceIdentifier" --template-file ./infra/infra.yaml --parameter-overrides=$Parameters --capabilities CAPABILITY_NAMED_IAM 